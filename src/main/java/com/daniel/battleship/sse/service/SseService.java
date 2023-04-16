package com.daniel.battleship.sse.service;

import java.util.List;

import org.springframework.data.util.Pair;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import com.daniel.battleship.entity.Game;

public interface SseService {

	void subscribe(SseEmitter sse, Object extraData);

	void unsubscribe(String username);
	
	void sendMessages();

	void response(Game game);

	default Pair<String, String> getPlayers(int i) {
		throw new UnsupportedOperationException("Operacion sin definir");	
	}
	
	default int areThereMatches() {
		throw new UnsupportedOperationException("Operacion sin definir");	
	}

	default List<Game> alreadyGames() {
		throw new UnsupportedOperationException("Operacion sin definir");
	}
	
}
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  