package com.daniel.battleship.service;

import java.util.List;

import com.daniel.battleship.entity.AppUser;
import com.daniel.battleship.entity.Box;
import com.daniel.battleship.entity.EmptyBox;
import com.daniel.battleship.entity.Game;
import com.daniel.battleship.entity.Record;
import com.daniel.battleship.service.base.BaseService;

public interface RecordService extends BaseService<Record, Long> {
	
	Record registerRecord(AppUser user, Game game, Box box);	
	Record registerRecord(AppUser user, Game game, EmptyBox emptyBox);
	List<Record> getGameRecords(String gameCode);
	
}
