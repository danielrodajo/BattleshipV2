package com.daniel.battleship.service.impl;

import java.util.Date;
import java.util.List;

import org.springframework.stereotype.Service;

import com.daniel.battleship.entity.AppUser;
import com.daniel.battleship.entity.Box;
import com.daniel.battleship.entity.EmptyBox;
import com.daniel.battleship.entity.Game;
import com.daniel.battleship.entity.Record;
import com.daniel.battleship.repository.RecordRepository;
import com.daniel.battleship.service.RecordService;
import com.daniel.battleship.util.Utils;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RecordServiceImpl implements RecordService {

	private final RecordRepository repository;
	
	@Override
	public Record save(Record item) {
		return repository.save(item);
	}

	@Override
	public Record update(Record item) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public void delete(Record item) {
		// TODO Auto-generated method stub

	}

	@Override
	public Record getById(Long id) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public List<Record> getAll() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public Record registerRecord(AppUser user, Game game, Box box) {
		Record record = Record.builder()
		.game(game)
		.player(user)
		.box(box)
		.createdAt(new Date())
		.build();
		return this.save(record);
	}

	@Override
	public Record registerRecord(AppUser user, Game game, EmptyBox emptyBox) {
		Record record = Record.builder()
		.game(game)
		.player(user)
		.emptyBox(emptyBox)
		.createdAt(new Date())
		.build();
		return this.save(record);
	}

	@Override
	public List<Record> getGameRecords(String gameCode) {
		List<Record> records = repository.findByGameCode(gameCode);
		records.forEach(record -> {
			record.getGame().setBoard1(null);
			record.getGame().setBoard2(null);
			Utils.filterUserData(record.getPlayer());
		});
		return records;
	}

}
