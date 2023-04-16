package com.daniel.battleship.cron;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.util.Pair;
import org.springframework.scheduling.annotation.Scheduled;

import com.daniel.battleship.entity.Game;
import com.daniel.battleship.service.GameService;
import com.daniel.battleship.sse.service.SseService;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@Configuration
@RequiredArgsConstructor
@Log4j2
public class SSECron {

	@Qualifier("queueService")
	private final SseService queueService;
	
	@Qualifier("prepareGameService")
	private final SseService prepareGameService;
	
	private final GameService gameService;

	@Scheduled(fixedRate = 3000)
	public void handleGameQueue() {
		queueService.sendMessages();
		int matches = queueService.areThereMatches();
		
		List<String> usersProccesed = new ArrayList<>();
		for (int i = 0; i < matches; i++) {
			log.info("Numero de partidas a crear: {}", matches);
			Pair<String, String> namePlayers = queueService.getPlayers(i+1);
			Game game = gameService.createGame(namePlayers);
			log.info("Partida creada con id {} para los jugadores {} y {}", game.getId(), namePlayers.getFirst(),
					namePlayers.getSecond());
			queueService.response(game);
			usersProccesed.add(namePlayers.getFirst());
			usersProccesed.add(namePlayers.getSecond());
		}
		usersProccesed.forEach(queueService::unsubscribe);
	}

	@Scheduled(fixedRate = 3000)
	public void handlePrepareGameQueue() {
		prepareGameService.sendMessages();
		List<Game> games = prepareGameService.alreadyGames();
		List<String> usersProccesed = new ArrayList<>();
		for (Game game : games) {
			log.info("Numero de partidas a preparadas: {}", games.size());
			game = gameService.initGame(game);
			prepareGameService.response(game);
			usersProccesed.add(game.getBoard1().getOwner().getEmail());
			usersProccesed.add(game.getBoard2().getOwner().getEmail());
		}
		usersProccesed.forEach(prepareGameService::unsubscribe);
	}

}
