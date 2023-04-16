package com.daniel.battleship.service.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.daniel.battleship.entity.Box;
import com.daniel.battleship.entity.Ship;
import com.daniel.battleship.repository.BoxRepository;
import com.daniel.battleship.service.BoxService;
import com.daniel.battleship.service.ShipService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class BoxServiceImpl implements BoxService {

	private final BoxRepository boxRepository;
	private final ShipService shipService;

	@Override
	public Box save(Box box) {
		return boxRepository.save(box);
	}

	@Override
	public Box update(Box box) {
		return boxRepository.save(box);
	}

	@Override
	public void delete(Box box) {
	}

	@Override
	public Box getById(Long id) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public List<Box> getAll() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public List<Box> initBoxes(List<Box> boxes) {
		Map<Ship, Long> ships = boxes.stream().collect(Collectors.groupingBy(b -> b.getShip(), Collectors.counting()));
		
		List<Box> result = new ArrayList<>();
		for (Entry<Ship, Long> entry : ships.entrySet()) {
			Ship ship = Ship.builder()
					.id(entry.getKey().getId())
					.lives(entry.getKey().getLives())
					.shipType(entry.getKey().getShipType())
					.build();
			Long fakeId = ship.getId();
			ship.setId(-1L);
			ship = shipService.save(ship);

			List<Box> filteredBoxes = boxes.stream().filter(box -> box.getShip().getId().equals(fakeId))
					.collect(Collectors.toList());
			
			for (Box box : filteredBoxes) {
				box.setShip(ship);
				result.add(box);
			}
		}
		
		for (Box box : result) {
			box = this.save(box);
		}

		return result;
	}

	@Override
	public Box hitBox(Box box) {
		if (box.getTouched())
			throw new IllegalArgumentException("La celda ya esta marcada");
		
		box.setTouched(true);
		return this.update(box);
	}

}
