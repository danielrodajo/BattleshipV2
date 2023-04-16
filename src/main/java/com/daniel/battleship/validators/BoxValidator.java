package com.daniel.battleship.validators;

import org.springframework.stereotype.Service;

import com.daniel.battleship.entity.Board;
import com.daniel.battleship.enums.BoardState;
import com.daniel.battleship.repository.BoardRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class BoxValidator {
	
	private final BoardRepository repository;

	public Board validateInitBoard(Board board) {
		if (!repository.existsBoardByCode(board.getCode())) {
			throw new IllegalArgumentException("No existe este tablero");
		}
		Board boardBBDD = repository.findByCode(board.getCode()).orElse(null);
		if (!boardBBDD.getState().equals(BoardState.CREATED)) {
			throw new IllegalArgumentException("No se puede actualizar este tablero");
		}
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
	
}
