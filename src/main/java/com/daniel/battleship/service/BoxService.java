package com.daniel.battleship.service;

import java.util.List;

import com.daniel.battleship.entity.Box;
import com.daniel.battleship.service.base.BaseService;

public interface BoxService extends BaseService<Box, Long> {

	List<Box> initBoxes(List<Box> boxes);
	
	Box hitBox(Box box);
	
}
