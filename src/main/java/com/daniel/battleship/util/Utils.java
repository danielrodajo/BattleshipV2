package com.daniel.battleship.util;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.security.core.context.SecurityContextHolder;

import com.daniel.battleship.entity.AppUser;
import com.daniel.battleship.entity.Board;
import com.daniel.battleship.entity.Box;
import com.daniel.battleship.entity.Game;
import com.daniel.battleship.enums.BoardState;

public class Utils {
	
	public static String getCurrentUsername() {
		return SecurityContextHolder.getContext().getAuthentication().getName();
	}

	public static String generateCode() {
		return UUID.randomUUID().toString();
	}
	
	public static Board filterBoardData(Board board) {
		board.setBoxes(null);
		board.setId(null);
		board.setCode(null);
		board.setEmptyBoxes(null);
		board.setHeight(null);
		board.setWidth(null);
		board.setOwner(Utils.filterUserData(board.getOwner()));
		return board;
	}
	
	public static AppUser filterUserData(AppUser user) {
		user.setName(null);
		user.setFirstsurname(null);
		user.setSecondsurname(null);
		user.setId(null);
		user.setEmail(null);
		return user;
	}
	
	public static Long calculatePoints(Game game) {
		Board winnerBoard = null;
		Board looserBoard = null;
		if (game.getBoard1().getState().equals(BoardState.WIN)) {
			winnerBoard = game.getBoard1();
			looserBoard = game.getBoard2();
		} else {
			winnerBoard = game.getBoard2();
			looserBoard = game.getBoard1();
		}
		List<Box> untouchedBoxes = winnerBoard.getBoxes().stream().filter(b -> !b.getTouched())
				.collect(Collectors.toList());
		long points = untouchedBoxes.size() * 3;

		long diffPlayers = looserBoard.getOwner().getPoints() - winnerBoard.getOwner().getPoints();
		long diff = (diffPlayers / 100) * 10;
		if (points + diff < 10) {
			points = 10;
		} else if (points + diff > 100) {
			points = 100;
		} else {
			points += diff;
		}

		return points;
	}
}
