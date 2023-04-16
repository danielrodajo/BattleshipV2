package com.daniel.battleship.util;

public class Constants {

	public static final String SECURED_GAME_ROOM = "/api/v1/ws/game/room";
	public static final String SECURED_GAME_OPPONENT_ALIVE = "/api/v1/ws/game/opponent-alive";
    public static final String SECURED_GAME = "/ws/game";

    public static final String WS_OPPONENT_ALIVE_RESPONSE = "/user/queue/opponent-alive";
    public static final String WS_TURN_RESPONSE = "/user/queue/turn";
    public static final String WS_TURN_MISSED_RESPONSE = "/user/queue/turn-missed";
    public static final String WS_HITTED_RESPONSE = "/user/queue/hitted";
    public static final String WS_MISSED_RESPONSE = "/user/queue/missed";
    public static final String WS_ERROR_RESPONSE = "/user/queue/error";
    public static final String WS_FINISH_GAME_RESPONSE = "/user/queue/finish";
	
}
