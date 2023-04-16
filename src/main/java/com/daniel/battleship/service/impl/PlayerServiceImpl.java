package com.daniel.battleship.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.daniel.battleship.entity.AppUser;
import com.daniel.battleship.repository.UserRepository;
import com.daniel.battleship.service.PlayerService;

@Service
public class PlayerServiceImpl implements PlayerService {

	@Autowired
	private UserRepository userRepository;
	
	@Override
	public AppUser save(AppUser player) {
		return this.userRepository.save(player);
	}

	@Override
	public AppUser update(AppUser player) {
		return this.userRepository.save(player);
	}

	@Override
	public void delete(AppUser player) {
		this.userRepository.delete(player);
	}

	@Override
	public AppUser getById(Long id) {
		return this.userRepository.findById(id).orElse(null);
	}

	@Override
	public List<AppUser> getAll() {
		return this.userRepository.findAll();
	}

	@Override
	public AppUser getUserData() {
		String username = SecurityContextHolder.getContext().getAuthentication().getName();
		return this.userRepository.findByEmail(username).orElseThrow();
	}

	@Override
	public AppUser getByEmail(String email) {
		return this.userRepository.findByEmail(email).orElseThrow();
	}
	
}