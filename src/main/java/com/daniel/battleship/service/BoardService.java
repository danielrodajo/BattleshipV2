package com.daniel.battleship.service;

import com.daniel.battleship.entity.Board;
import com.daniel.battleship.entity.EmptyBox;
import com.daniel.battleship.service.base.BaseService;

public interface BoardService extends BaseService<Board, Long> {

	Board initBoard(Board board);
	Board getBoardByCode(String code);
	Board hitEmptyBox(Board board, EmptyBox emptyBox);
	
}
