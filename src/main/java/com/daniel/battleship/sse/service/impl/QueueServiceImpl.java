package com.daniel.battleship.sse.service.impl;

import java.io.IOException;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

import org.springframework.data.util.Pair;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter.SseEventBuilder;

import com.daniel.battleship.entity.Game;
import com.daniel.battleship.sse.service.SseService;
import com.daniel.battleship.util.Utils;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@Service("queueService")
@RequiredArgsConstructor
@Log4j2
public class QueueServiceImpl implements SseService {

	private Map<String, SseEmitter> emitters = new LinkedHashMap<>();

	@Override
	public void subscribe(SseEmitter emitter, Object extraData) {
		String username = Utils.getCurrentUsername();
		log.info("Subscribirse a la cola de partidas - {}", username);

		emitter.onCompletion(() -> {
			log.info("Subscripcion finalizada - {}", username);
			unsubscribe(username);
		});

		emitter.onTimeout(() -> {
			log.info("Timeout - {}", username);
			unsubscribe(username);
		});

		registerEmitter(emitter, username);
	}

	@Override
	public void unsubscribe(String username) {
		emitters.remove(username);
	}

	@Override
	public void sendMessages() {
		List<String> failed = new ArrayList<>();
		emitters.forEach((username, emitter) -> {
			log.info(username);
			try {
				emitter.send("searching");
			} catch (IOException e) {
				emitter.completeWithError(e);
				failed.add(username);
			}
		});
		failed.forEach(this::unsubscribe);
	}

	@Override
	public void response(Game game) {
		response(emitters.get(game.getBoard1().getOwner().getEmail()), game.getId());
		response(emitters.get(game.getBoard2().getOwner().getEmail()), game.getId());
	}

	@Override
	public int areThereMatches() {
		return emitters.size() / 2;
	}

	@Override
	public Pair<String, String> getPlayers(int i) {
		var usernames = emitters.keySet().toArray();
		return Pair.of((String) usernames[i * 2 - 2], (String) usernames[i * 2 - 1]);
	}

	private void response(SseEmitter emitter, Object data) {
		ExecutorService sseMvcExecutor = Executors.newSingleThreadExecutor();
		sseMvcExecutor.execute(() -> {
			try {
				SseEventBuilder event = SseEmitter.event().data(data).id(UUID.randomUUID().toString()).name("game");
				emitter.send(event);
			} catch (Exception ex) {
				emitter.completeWithError(ex);
			}
		});
	}

	private void registerEmitter(SseEmitter emitter, String username) {
		emitters.put(username, emitter);
	}

}
