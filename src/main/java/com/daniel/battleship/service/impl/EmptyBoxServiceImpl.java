package com.daniel.battleship.service.impl;

import java.util.List;

import org.springframework.stereotype.Service;

import com.daniel.battleship.entity.EmptyBox;
import com.daniel.battleship.repository.EmptyBoxRepository;
import com.daniel.battleship.service.EmptyBoxService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class EmptyBoxServiceImpl implements EmptyBoxService {

	private final EmptyBoxRepository repository;
	
	@Override
	public EmptyBox save(EmptyBox item) {
		
		return repository.save(item);
	}

	@Override
	public EmptyBox update(EmptyBox item) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public void delete(EmptyBox item) {
		// TODO Auto-generated method stub

	}

	@Override
	public EmptyBox getById(Long id) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public List<EmptyBox> getAll() {
		// TODO Auto-generated method stub
		return null;
	}

}
