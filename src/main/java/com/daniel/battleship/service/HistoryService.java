package com.daniel.battleship.service;

import com.daniel.battleship.entity.AppUser;
import com.daniel.battleship.entity.Box;
import com.daniel.battleship.entity.EmptyBox;
import com.daniel.battleship.entity.Game;
import com.daniel.battleship.entity.History;
import com.daniel.battleship.service.base.BaseService;

public interface HistoryService extends BaseService<History, Long> {
	
	History registerHistory(AppUser user, Game game, Box box);	
	History registerHistory(AppUser user, Game game, EmptyBox emptyBox);
	
}
