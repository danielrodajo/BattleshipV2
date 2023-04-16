package com.daniel.battleship.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.ResponseBodyEmitter;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import com.daniel.battleship.dto.GameDTO;
import com.daniel.battleship.entity.Game;
import com.daniel.battleship.mapper.GameMapper;
import com.daniel.battleship.service.GameService;
import com.daniel.battleship.sse.service.SseService;
import com.daniel.battleship.util.Endpoint;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@CrossOrigin
@RestController
@RequestMapping(Endpoint.VERSION + Endpoint.Game.ROOT)
@Tag(name = "Game Controller", description = "Controlador para las operaciones relacionadas con las partidas")
@RequiredArgsConstructor
public class GameController {

	private final GameService gameService;
	private final GameMapper mapper;

	@Qualifier("queueService")
	private final SseService queueService;

	@Qualifier("prepareGameService")
	private final SseService prepareGameService;

	private final Long SSE_TIMEOUT = 50000000000000L;

	@GetMapping(path = "searching", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
	@Operation(description = "Buscar partida")
	@ApiResponse(description = "El usuario se subscribe a la cola y recibirá el ID de una partida cuando se encuentre una")
	public ResponseBodyEmitter subscribeQueue(HttpServletResponse response) {
		SseEmitter emitter = new SseEmitter(SSE_TIMEOUT);
		queueService.subscribe(emitter, null);
		return emitter;
	}

	@GetMapping(path = "waitingGame", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
	@Operation(description = "Esperar a iniciar partida")
	@ApiResponse(description = "El usuario se subscribe a la espera de que ambas partes esten listas para comenzar la partida")
	public ResponseBodyEmitter subscribePrepareGame(@RequestParam String boardCode, HttpServletResponse response) {
		SseEmitter emitter = new SseEmitter(SSE_TIMEOUT);
		prepareGameService.subscribe(emitter, boardCode);
		return emitter;
	}

	@PostMapping
	@Operation(description = "Crea una nueva partida")
	@ApiResponse(description = "Partida guardada en BBDD")
	public ResponseEntity<GameDTO> saveGame(@RequestBody GameDTO gameDTO) {
		Game game = this.gameService.save(mapper.toEntity(gameDTO));
		return ResponseEntity.ok(mapper.toDTO(game));
	}

	@GetMapping(path = "getCurrentGameByCode")
	@Operation(description = "Obtener datos de partida")
	@ApiResponse(description = "El usuario obtiene sus datos de partida y los visibles del oponente")
	public ResponseEntity<GameDTO> getCurrentGameByCode(@RequestParam String code) {
		Game game = gameService.getCurrentGame(code);
		return ResponseEntity.ok(mapper.toDTO(game));
	}

	@PutMapping
	@Operation(description = "Actualiza una partida")
	@ApiResponse(description = "Partida actualizada en BBDD")
	public ResponseEntity<GameDTO> updateGame(@RequestBody GameDTO gameDTO) {
		Game game = this.gameService.update(mapper.toEntity(gameDTO));
		return ResponseEntity.ok(mapper.toDTO(game));
	}

	@GetMapping("/getGame")
	@Operation(description = "Obtiene una partida por su ID")
	@ApiResponse(description = "Partida obtenida")
	public ResponseEntity<GameDTO> getGame(Long id) {
		Game game = this.gameService.getById(id);
		return ResponseEntity.ok(mapper.toDTO(game));
	}

	@GetMapping("getMyGames")
	@Operation(description = "Obtener lista completa de mis partidas")
	@ApiResponse(description = "Lista de mis partidas")
	public ResponseEntity<List<GameDTO>> getMyGames() {
		List<Game> games = this.gameService.getMyGames();
		return ResponseEntity.ok(mapper.toListDTO(games));
	}

	@GetMapping("getAll")
	@Operation(description = "Obtener lista completa de partidas")
	@ApiResponse(description = "Lista de partidas")
	public ResponseEntity<List<GameDTO>> getAllGames() {
		List<Game> games = this.gameService.getAll();
		return ResponseEntity.ok(mapper.toListDTO(games));
	}

	@DeleteMapping
	@Operation(description = "Elimina una partida")
	public ResponseEntity<Void> deleteGame(@RequestBody GameDTO gameDTO) {
		this.gameService.delete(mapper.toEntity(gameDTO));
		return ResponseEntity.ok().build();
	}

}
