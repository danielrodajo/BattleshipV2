package com.daniel.battleship.util;

import lombok.AccessLevel;
import lombok.NoArgsConstructor;

@NoArgsConstructor(access = AccessLevel.NONE)
public class Endpoint {

	public static final String VERSION = "/api/v1";

	@NoArgsConstructor(access = AccessLevel.NONE)
	public class Auth {
		public static final String ROOT = "/auth";
		public static final String SIGNUP = "/register";
		public static final String SIGNIN = "/authenticate";
		public static final String REFRESH_TOKEN = "/refresh";
	}

	@NoArgsConstructor(access = AccessLevel.NONE)
	public class Board {
		public static final String ROOT = "/board";
		public static final String INIT_BOARD = "/initBoard";
		public static final String GET_BOARD_BY_CODE = "/getBoardByCode";
		public static final String GET_BOARD_BY_GAME = "/getBoardByGame";
	}

	@NoArgsConstructor(access = AccessLevel.NONE)
	public class Game {
		public static final String ROOT = "/game";
	}

	@NoArgsConstructor(access = AccessLevel.NONE)
	public class Queue {
		public static final String ROOT = "/queue";
	}

	@NoArgsConstructor(access = AccessLevel.NONE)
	public class User {
		public static final String ROOT = "/user";
	}

}
