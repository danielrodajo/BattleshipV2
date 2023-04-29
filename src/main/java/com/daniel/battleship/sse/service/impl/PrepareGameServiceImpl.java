package com.daniel.battleship.sse.service.impl;

import java.io.IOException;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter.SseEventBuilder;

import com.daniel.battleship.entity.Game;
import com.daniel.battleship.enums.BoardState;
import com.daniel.battleship.service.GameService;
import com.daniel.battleship.sse.service.SseService;
import com.daniel.battleship.util.Utils;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@Service("prepareGameService")
@RequiredArgsConstructor
@Log4j2
public class PrepareGameServiceImpl implements SseService {

	private Map<String, Entry<Game, SseEmitter>> emitters = new LinkedHashMap<>();
	private final GameService gameService;

	@Override
	public void subscribe(SseEmitter emitter, Object boardCode) {
		String username = Utils.getCurrentUsername();
		log.info("Subscribirse a la espera de partida - {}", username);

		emitter.onCompletion(() -> {
			log.info("Subscripcion espera de partida finalizada - {}", username);
			unsubscribe(username);
		});

		emitter.onTimeout(() -> {
			log.info("Timeout espera de partida - {}", username);
			unsubscribe(username);
		});

		registerEmitter(emitter, username, (String) boardCode);
	}

	@Override
	public void unsubscribe(String username) {
		emitters.remove(username);
	}

	@Override
	public List<Game> alreadyGames() {
		List<Game> games = emitters.values().stream().map(entry -> entry.getKey())
				.filter(game -> game.getBoard1().getState().equals(BoardState.IN_PROGRESS)
						&& game.getBoard2().getState().equals(BoardState.IN_PROGRESS))
				.distinct().collect(Collectors.toList());
		return games;
	}

	@Override
	public void sendMessages() {
		List<String> failed = new ArrayList<>();
		emitters.forEach((username, entry) -> {
			log.info(username);
			try {
				entry.getValue().send("waiting");
			} catch (IOException e) {
				entry.getValue().completeWithError(e);
				failed.add(username);
			}
		});
		failed.forEach(this::unsubscribe);
	}

	@Override
	public void response(Game game) {
		response(emitters.get(game.getBoard1().getOwner().getEmail()).getValue(), game.getCode());
		response(emitters.get(game.getBoard2().getOwner().getEmail()).getValue(), game.getCode());
	}

	private void response(SseEmitter emitter, Object data) {
		ExecutorService sseMvcExecutor = Executors.newSingleThreadExecutor();
		sseMvcExecutor.execute(() -> {
			try {
				SseEventBuilder event = SseEmitter.event().data(data).id(UUID.randomUUID().toString()).name("game");
				emitter.send(event);
			} catch (Exception ex) {
				emitter.completeWithError(ex);
			}
		});
	}

	private void registerEmitter(SseEmitter emitter, String username, String boardCode) {
		Game game = Optional.of(gameService.getGameByBoardCode(boardCode))
				.orElseThrow(() -> new IllegalArgumentException("El tablero no tiene partida vinculada"));
		
		emitters.put(username, Map.entry(game, emitter));
	}

}
