package com.daniel.battleship.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.daniel.battleship.dto.BoardDTO;
import com.daniel.battleship.entity.Board;
import com.daniel.battleship.entity.Game;
import com.daniel.battleship.mapper.BoardMapper;
import com.daniel.battleship.service.BoardService;
import com.daniel.battleship.service.GameService;
import com.daniel.battleship.util.Endpoint;
import com.daniel.battleship.util.Utils;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping(Endpoint.VERSION + Endpoint.Board.ROOT)
@Tag(name = "Board Controller", description = "Controlador para las operaciones relacionadas con la mesa del jugador")
@RequiredArgsConstructor
public class BoardController {

	private final BoardMapper mapper;
	private final BoardService boardService;
	private final GameService gameService;

	@PostMapping(Endpoint.Board.INIT_BOARD)
	@Operation(description = "Sube la mesa con la configuracion para iniciar")
	@ApiResponse(description = "Mesa obtenida")
	public ResponseEntity<BoardDTO> initBoard(@RequestBody BoardDTO dto) {
		Board board = boardService.initBoard(mapper.toEntity(dto));
		return ResponseEntity.ok(mapper.toDTO(board));
	}

	@GetMapping(Endpoint.Board.GET_BOARD_BY_CODE)
	@Operation(description = "Obtiene la mesa del jugador a partir de su codigo")
	@ApiResponse(description = "Mesa obtenida")
	public ResponseEntity<BoardDTO> getBoardByCode(String code) {
		Board board = boardService.getBoardByCode(code);
		return ResponseEntity.ok(mapper.toDTO(board));
	}

	@GetMapping(Endpoint.Board.GET_BOARD_BY_GAME)
	@Operation(description = "Obtiene la mesa del jugador a partir del ID de la partida")
	@ApiResponse(description = "Mesa obtenida")
	public ResponseEntity<BoardDTO> getBoardByGameId(Long id) {
		Game game = this.gameService.getById(id);
		Board board = null;
		if (game.getBoard1().getOwner().getEmail().equals(Utils.getCurrentUsername())) {
			board = game.getBoard1();
		} else if (game.getBoard2().getOwner().getEmail().equals(Utils.getCurrentUsername())) {
			board = game.getBoard2();
		} else {
			return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
		}
		return ResponseEntity.ok(mapper.toDTO(board));
	}
}
