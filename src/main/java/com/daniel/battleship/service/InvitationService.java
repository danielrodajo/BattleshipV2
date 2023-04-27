package com.daniel.battleship.service;

import com.daniel.battleship.entity.Game;
import com.daniel.battleship.entity.Invitation;
import com.daniel.battleship.service.base.BaseService;

public interface InvitationService extends BaseService<Invitation, Long> {
	
	Invitation getByCode(String code);
	Invitation createByGame(Game game);
}
