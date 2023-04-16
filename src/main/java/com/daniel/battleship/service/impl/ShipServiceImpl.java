package com.daniel.battleship.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.daniel.battleship.entity.Ship;
import com.daniel.battleship.repository.ShipRepository;
import com.daniel.battleship.service.ShipService;

@Service
public class ShipServiceImpl implements ShipService {

	@Autowired
	private ShipRepository shipRepository;
	
	@Override
	public Ship save(Ship ship) {
		return shipRepository.save(ship);
	}

	@Override
	public Ship update(Ship ship) {
		return shipRepository.save(ship);
	}

	@Override
	public void delete(Ship ship) {
	}

	@Override
	public Ship getById(Long id) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public List<Ship> getAll() {
		// TODO Auto-generated method stub
		return null;
	}

}
