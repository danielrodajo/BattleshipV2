package com.daniel.battleship.service;

import com.daniel.battleship.entity.AppUser;
import com.daniel.battleship.service.base.BaseService;

public interface PlayerService extends BaseService<AppUser, Long> {

	AppUser getUserData();
	AppUser getByEmail(String email);
	AppUser addPoints(Long points, AppUser user);

}
