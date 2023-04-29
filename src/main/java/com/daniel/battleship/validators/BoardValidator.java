package com.daniel.battleship.validators;

import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.daniel.battleship.entity.Board;
import com.daniel.battleship.entity.Box;
import com.daniel.battleship.entity.Game;
import com.daniel.battleship.entity.Ship;
import com.daniel.battleship.enums.BoardState;
import com.daniel.battleship.enums.ShipType;
import com.daniel.battleship.repository.BoardRepository;
import com.daniel.battleship.service.GameService;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@Service
@RequiredArgsConstructor
@Log4j2
public class BoardValidator {

	private final BoardRepository repository;
	private final GameService gameService;

	public Board validateInitBoard(Board board) {
		Board boardBBDD = repository.findByCode(board.getCode()).orElse(null);
		if (Objects.isNull(boardBBDD)) {
			throw new IllegalArgumentException("No existe este tablero");
		}
		if (!boardBBDD.getState().equals(BoardState.CREATED)) {
			throw new IllegalArgumentException("No se puede actualizar este tablero");
		}
		validatePlacedShips(board);
		validatePositionShips(board);

		return boardBBDD;
	}

	public void validateSaveBoard(Board board) {
		if (repository.existsBoardByCode(board.getCode())) {
			throw new IllegalArgumentException("Ya existe este tablero");
		}
	}

	public void validateUpdateBoard(Board board) {
		if (!repository.existsBoardByCode(board.getCode())) {
			throw new IllegalArgumentException("No existe este tablero");
		}
	}

	public Boolean existsById(Board board) {
		return repository.existsById(board.getId());
	}

	private void validatePlacedShips(Board board) {
		Game game = Optional.of(gameService.getGameByBoardCode(board.getCode()))
				.orElseThrow(() -> new IllegalArgumentException("El tablero no tiene partida vinculada"));

		List<Ship> ships = getShipsFromBoard(board);

		Map<ShipType, Long> countShipTypes = ships.stream()
				.collect(Collectors.groupingBy(Ship::getShipType, Collectors.counting()));

		validateShipTypeCount(countShipTypes, ShipType.CARRIER, game.getCarriers());
		validateShipTypeCount(countShipTypes, ShipType.BATTLESHIP, game.getBattleships());
		validateShipTypeCount(countShipTypes, ShipType.SUBMARINE, game.getSubmarines());
		validateShipTypeCount(countShipTypes, ShipType.DESTROYER, game.getDestroyers());
	}

	private void validateShipTypeCount(Map<ShipType, Long> countShipTypes, ShipType shipType, long expectedCount) {
		Long actualCount = countShipTypes.getOrDefault(shipType, 0L);
		if (actualCount != expectedCount) {
			log.error("No coincide la cantidad de {}. Game: {} - Input: {}", shipType.name(), expectedCount,
					actualCount);
			throw new IllegalArgumentException("La configuración de barcos no es correcta");
		}
	}

	private void validatePositionShips(Board board) {
		board.getBoxes().stream().filter(box -> isOutOfBounds(box, board)).findFirst().ifPresent(outOfBoundsBox -> {
			log.error(
					"La celda con ID {} y coordenadas X: {} - Y: {} se salen de los limites. Ancho maximo: {} - Altura maxima: {}",
					outOfBoundsBox.getId(), outOfBoundsBox.getX(), outOfBoundsBox.getY(), board.getWidth(),
					board.getHeight());
			throw new IllegalArgumentException("Los barcos se salen de los límites del tablero");
		});

		Map<Object, List<Box>> groupedBoxes = board.getBoxes().stream()
				.collect(Collectors.groupingBy(box -> box.getShip().getId()));

		board.getBoxes().forEach(box -> {
			groupedBoxes.entrySet().stream().filter(entry -> !entry.getKey().equals(box.getShip().getId()))
					.flatMap(entry -> entry.getValue().stream()).filter(b -> areAdjacent(box, b)).findFirst()
					.ifPresent(adjoiningBox -> {
						log.error("Conflicto entre las siguientes celdas: {} - {}", box, adjoiningBox);
						throw new IllegalArgumentException("Los barcos no pueden colindar entre ellos");
					});
		});
	}

	private boolean isOutOfBounds(Box box, Board board) {
		return box.getX() < 0 || box.getY() < 0 || box.getX() > board.getWidth() - 1
				|| box.getY() > board.getHeight() - 1;
	}

	private boolean areAdjacent(Box box, Box otherBox) {
		return (Math.abs(box.getX() - otherBox.getX()) <= 1) && (Math.abs(box.getY() - otherBox.getY()) <= 1);
	}

	private List<Ship> getShipsFromBoard(Board board) {
		return board.getBoxes().stream().map(Box::getShip).distinct().collect(Collectors.toList());
	}

}
