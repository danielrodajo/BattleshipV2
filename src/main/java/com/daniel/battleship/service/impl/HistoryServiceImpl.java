package com.daniel.battleship.service.impl;

import java.util.List;

import org.springframework.stereotype.Service;

import com.daniel.battleship.entity.AppUser;
import com.daniel.battleship.entity.Box;
import com.daniel.battleship.entity.EmptyBox;
import com.daniel.battleship.entity.Game;
import com.daniel.battleship.entity.History;
import com.daniel.battleship.repository.HistoryRepository;
import com.daniel.battleship.service.HistoryService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class HistoryServiceImpl implements HistoryService {

	private final HistoryRepository repository;
	
	@Override
	public History save(History item) {
		return repository.save(item);
	}

	@Override
	public History update(History item) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public void delete(History item) {
		// TODO Auto-generated method stub

	}

	@Override
	public History getById(Long id) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public List<History> getAll() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public History registerHistory(AppUser user, Game game, Box box) {
		History history = History.builder()
		.game(game)
		.player(user)
		.box(box)
		.build();
		return this.save(history);
	}

	@Override
	public History registerHistory(AppUser user, Game game, EmptyBox emptyBox) {
		History history = History.builder()
		.game(game)
		.player(user)
		.emptyBox(emptyBox)
		.build();
		return this.save(history);
	}

}
