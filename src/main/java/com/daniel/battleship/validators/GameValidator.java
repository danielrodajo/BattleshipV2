package com.daniel.battleship.validators;

import java.util.Objects;

import org.springframework.stereotype.Service;

import com.daniel.battleship.entity.Game;
import com.daniel.battleship.enums.GameState;
import com.daniel.battleship.repository.GameRepository;
import com.daniel.battleship.util.Utils;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@Service
@RequiredArgsConstructor
@Log4j2
public class GameValidator {

	private final GameRepository repository;

	public void validateSaveGame(Game game) {
		if (repository.existsByCode(game.getCode())) {
			throw new IllegalArgumentException("Ya existe esta partida");
		}

		if (game.getCarriers() == 0 && game.getBattleships() == 0 && game.getSubmarines() == 0
				&& game.getDestroyers() == 0) {
			throw new IllegalArgumentException("No se puede crear una partida sin barcos");
		}
	}

	public void validateUpdateGame(Game game) {
		if (!repository.existsByCode(game.getCode())) {
			throw new IllegalArgumentException("No existe esta partida");
		}
		Game gameBBDD = repository.findByCode(game.getCode()).orElse(null);
		if (gameBBDD.getState().equals(GameState.FINALIZED)) {
			throw new IllegalArgumentException("No se puede modificar ya esta partida");
		}
	}

	public Boolean existsById(Game game) {
		return repository.existsById(game.getId());
	}

	public void validateJoinGame(Game game) {
		if (game.getBoard1().getOwner().getEmail().equals(Utils.getCurrentUsername())) {
			throw new IllegalArgumentException("No puedes registrarte a tu propia partida");
		}

		if (Objects.nonNull(game.getBoard2())) {
			log.error("La partida con ID {} ya está vinculada al jugador {}", game.getId(),
					game.getBoard2().getOwner().getEmail());
			throw new IllegalArgumentException("No te puedes registrar a esta partida");
		}

		if (!game.getState().equals(GameState.PREPARING)) {
			log.error("No se puede modificar la partida con ID {} porque se encuentra en estado {}", game.getId(),
					game.getState().toString());
			throw new IllegalArgumentException("No te puedes registrar a una partida ya creada");
		}
	}

	public void validateInitGame(Game game) {
		if (!game.getState().equals(GameState.CREATED)) {
			throw new IllegalArgumentException("No se puede inicializar esta partida");
		}

		if (Objects.isNull(game.getBoard1()) || Objects.isNull(game.getBoard2())) {
			throw new IllegalArgumentException("Faltan datos para empezar la partida");
		}

	}
}
