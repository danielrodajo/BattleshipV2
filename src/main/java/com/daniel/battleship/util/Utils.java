package com.daniel.battleship.util;

import java.util.UUID;

import org.springframework.security.core.context.SecurityContextHolder;

import com.daniel.battleship.entity.AppUser;
import com.daniel.battleship.entity.Board;

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
		return user;
	}
}
