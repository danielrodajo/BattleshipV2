package com.daniel.battleship.service.impl;

import java.util.List;
import java.util.NoSuchElementException;

import org.springframework.stereotype.Service;

import com.daniel.battleship.entity.Board;
import com.daniel.battleship.entity.EmptyBox;
import com.daniel.battleship.enums.BoardState;
import com.daniel.battleship.repository.BoardRepository;
import com.daniel.battleship.service.BoardService;
import com.daniel.battleship.service.BoxService;
import com.daniel.battleship.service.EmptyBoxService;
import com.daniel.battleship.util.Utils;
import com.daniel.battleship.validators.BoardValidator;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class BoardServiceImpl implements BoardService {

	private final BoardRepository repository;
	private final BoardValidator validator;
	private final BoxService boxService;
	private final EmptyBoxService emptyBoxService;
	

	@Override
	public Board initBoard(Board board) {
		Board boardBBDD = validator.validateInitBoard(board);
		boardBBDD.setBoxes(boxService.initBoxes(board.getBoxes()));
		boardBBDD.setState(BoardState.IN_PROGRESS);
		boardBBDD = this.update(boardBBDD);
		return boardBBDD;
	}
	
	@Override
	public Board save(Board board) {
		validator.validateSaveBoard(board);
		return repository.save(board);
	}

	@Override
	public Board update(Board board) {
		validator.validateUpdateBoard(board);
		return repository.save(board);
	}

	@Override
	public void delete(Board board) {
	}

	@Override
	public Board getById(Long id) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public List<Board> getAll() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public Board getBoardByCode(String code) {
		Board board = repository.findByCode(code).orElseThrow();
		if (!board.getOwner().getEmail().equals(Utils.getCurrentUsername())) {
			throw new NoSuchElementException("No value present");
		}
		return board;
	}

	@Override
	public Board hitEmptyBox(Board board, EmptyBox emptyBox) {
		EmptyBox boxBBDD = emptyBoxService.save(emptyBox);
		board.getEmptyBoxes().add(boxBBDD);
		return this.update(board);
	}

}
