package com.daniel.battleship.websocket.controller;

import java.security.Principal;
import java.util.HashMap;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Objects;

import org.springframework.context.event.EventListener;
import org.springframework.data.util.Pair;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.socket.messaging.SessionConnectEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

import com.daniel.battleship.entity.AppUser;
import com.daniel.battleship.entity.Board;
import com.daniel.battleship.entity.Box;
import com.daniel.battleship.entity.EmptyBox;
import com.daniel.battleship.entity.Game;
import com.daniel.battleship.enums.GameState;
import com.daniel.battleship.mapper.BoxMapper;
import com.daniel.battleship.mapper.EmptyBoxMapper;
import com.daniel.battleship.service.BoxService;
import com.daniel.battleship.service.EmptyBoxService;
import com.daniel.battleship.service.GameService;
import com.daniel.battleship.service.PlayerService;
import com.daniel.battleship.service.RecordService;
import com.daniel.battleship.util.Constants;
import com.daniel.battleship.websocket.dto.BoxCoordinates;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import io.jsonwebtoken.io.IOException;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@Controller
@RequiredArgsConstructor
@Log4j2
public class WebSocketController {

	private final SimpMessagingTemplate simpMessagingTemplate;
	private final GameService gameService;
	private final BoxService boxService;
	private final EmptyBoxService emptyBoxService;
	private final BoxMapper boxMapper;
	private final EmptyBoxMapper emptyBoxMapper;
	private Map<String, Entry<String, String>> data = new HashMap<>();
	private final RecordService recordService;
	private final PlayerService playerService;

	@MessageMapping(Constants.SECURED_GAME_OPPONENT_ALIVE)
	public void isOpponentAlive(Principal user) {
		Entry<String, Entry<String, String>> opponentData = getOpponentData(user.getName());
		simpMessagingTemplate.convertAndSendToUser(user.getName(), Constants.WS_OPPONENT_ALIVE_RESPONSE,  Objects.nonNull(opponentData));
	}
	
	@MessageMapping(Constants.SECURED_GAME_ROOM)
	public void hitBox(@Payload String coordinatesString, Principal user) {
		Entry<String, Entry<String, String>> opponentData = getOpponentData(user.getName());
		if (opponentData == null) {
			simpMessagingTemplate.convertAndSendToUser(user.getName(), Constants.WS_ERROR_RESPONSE, "El rival no está disponible para jugar");
			return;
		}

		try {
			ObjectMapper mapper = new ObjectMapper();
			BoxCoordinates coordinates = mapper.readValue(coordinatesString, BoxCoordinates.class);
			Pair<Object, Boolean> hitResult = hitBoxOpponent(opponentData.getKey(), opponentData.getValue().getValue(),
					coordinates);
			if (hitResult == null) {
				simpMessagingTemplate.convertAndSendToUser(user.getName(), Constants.WS_ERROR_RESPONSE, "ERROR");
				return;
			}

			boolean hittedBox = hitResult.getSecond();
			if (hittedBox) {
				handleHittedBox(opponentData.getKey(), user.getName(), opponentData.getValue().getValue(),
						(Box) hitResult.getFirst());
			} else {
				handleMissedBox(opponentData.getKey(), user.getName(), (EmptyBox) hitResult.getFirst());
			}
		} catch (IOException | JsonProcessingException e) {
			simpMessagingTemplate.convertAndSendToUser(user.getName(), Constants.WS_ERROR_RESPONSE, "ERROR");
			return;
		}
	}

	private Entry<String, Entry<String, String>> getOpponentData(String playerName) {
		return data.entrySet().stream()
				.filter(entry -> !entry.getKey().equals(playerName) && entry.getValue().getValue().equals(data.get(playerName).getValue()))
				.findFirst().orElse(null);
	}

	private void handleHittedBox(String opponentName, String playerName, String gameCode, Box hitResult) {
		Game game = gameService.getGameByCode(gameCode);
		if (game.getState().equals(GameState.FINALIZED)) {
			simpMessagingTemplate.convertAndSendToUser(playerName, Constants.WS_FINISH_GAME_RESPONSE, game.getPoints());
			simpMessagingTemplate.convertAndSendToUser(opponentName, Constants.WS_FINISH_GAME_RESPONSE, game.getPoints() * -1);
		} else {
			simpMessagingTemplate.convertAndSendToUser(playerName, Constants.WS_HITTED_RESPONSE,
					boxMapper.toDTO(hitResult));
			simpMessagingTemplate.convertAndSendToUser(opponentName, Constants.WS_TURN_RESPONSE,
					boxMapper.toDTO(hitResult));
		}
	}

	private void handleMissedBox(String opponentName, String playerName, EmptyBox hitResult) {
		simpMessagingTemplate.convertAndSendToUser(playerName, Constants.WS_MISSED_RESPONSE,
				emptyBoxMapper.toDTO(hitResult));
		simpMessagingTemplate.convertAndSendToUser(opponentName, Constants.WS_TURN_MISSED_RESPONSE,
				emptyBoxMapper.toDTO(hitResult));
	}

	@EventListener
	public void handleSessionConnected(SessionConnectEvent event) {
		StompHeaderAccessor accessor = StompHeaderAccessor.wrap(event.getMessage());
		var user = event.getUser();
		String gameCode = accessor.getFirstNativeHeader("game-code");
		data.put(user.getName(), Map.entry(accessor.getSessionId(), gameCode));
	}

	@EventListener
	public void onDisconnectEvent(SessionDisconnectEvent event) {
		StompHeaderAccessor accessor = StompHeaderAccessor.wrap(event.getMessage());
		if (data.get(event.getUser().getName()).getKey().equals(accessor.getSessionId())) {
			log.info("Client with username {} disconnected", event.getUser());
			data.remove(event.getUser().getName());
		}
	}

	@Transactional
	public Pair<Object, Boolean> hitBoxOpponent(String opponentName, String gameCode, BoxCoordinates coordinates) {
		Game game = gameService.getGameByCode(gameCode);
		Board myBoard = null;
		Board boardOpponent = null;

		if (game.getBoard1().getOwner().getEmail().equals(opponentName)) {
			myBoard = game.getBoard2();
			boardOpponent = game.getBoard1();
		} else if (game.getBoard2().getOwner().getEmail().equals(opponentName)) {
			myBoard = game.getBoard1();
			boardOpponent = game.getBoard2();
		} else {
			throw new IllegalArgumentException("No existe la partida");
		}

		Box hitBox = boardOpponent.getBoxes().stream()
				.filter(box -> box.getX().equals(coordinates.getX()) && box.getY().equals(coordinates.getY()))
				.findFirst().orElse(null);

		AppUser user = playerService.getByEmail(opponentName);
		if (hitBox != null) {
			if (hitBox.getTouched()) {
				throw new IllegalArgumentException("La celda ya esta marcada");
			}
			boxService.hitBox(hitBox);
			recordService.registerRecord(user, game, hitBox);
			if (checkGameFinished(boardOpponent)) {
				game = gameService.finishGame(game, myBoard);
			} else {
				gameService.nextTurn(game);
			}
			return Pair.of(hitBox, true);
		} else {
			EmptyBox emptyBox = boardOpponent.getEmptyBoxes().stream()
					.filter(box -> box.getX().equals(coordinates.getX()) && box.getY().equals(coordinates.getY()))
					.findFirst().orElse(null);
			if (emptyBox != null) {
				throw new IllegalArgumentException("La celda ya está marcada");
			}
			EmptyBox newBox = EmptyBox.builder().x(coordinates.getX()).y(coordinates.getY()).build();
			newBox = emptyBoxService.save(newBox);
			recordService.registerRecord(user, game, newBox);
			
			boardOpponent.getEmptyBoxes().add(newBox);
			gameService.nextTurn(game);
			return Pair.of(newBox, false);
		}
	}

	private boolean checkGameFinished(Board board) {
		long untouchedBoxes = board.getBoxes().stream().filter(box -> !box.getTouched()).count();
		return untouchedBoxes == 0;
	}
}
