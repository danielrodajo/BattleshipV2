package com.daniel.battleship.service;

import java.util.List;
import java.util.Optional;

import org.springframework.data.util.Pair;

import com.daniel.battleship.entity.Board;
import com.daniel.battleship.entity.Game;
import com.daniel.battleship.service.base.BaseService;

public interface GameService extends BaseService<Game, Long> {

	List<Game> getMyGames();
	Game getGameByCode(String code);
	Optional<Game> getGameByBoard1Code(String code);
	Optional<Game> getGameByBoard2Code(String code);
	Game createGame(Pair<String, String> namePlayers);
	Game initGame(Game game);
	Game getCurrentGame(String code);
	Game nextTurn(Game game);
	Game finishGame(Game game, Board winner);

}
