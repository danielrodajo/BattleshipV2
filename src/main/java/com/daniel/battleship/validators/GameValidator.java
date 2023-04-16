package com.daniel.battleship.validators;

import org.springframework.stereotype.Service;

import com.daniel.battleship.entity.Game;
import com.daniel.battleship.enums.GameState;
import com.daniel.battleship.repository.GameRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class GameValidator {
	
	private final GameRepository repository;

	
	public void validateSaveGame(Game game) {
		if (repository.existsByCode(game.getCode())) {
			throw new IllegalArgumentException("Ya existe esta partida");
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
	
}
