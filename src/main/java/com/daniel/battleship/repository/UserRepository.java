package com.daniel.battleship.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.daniel.battleship.entity.AppUser;

public interface UserRepository extends JpaRepository<AppUser, Long> {

	boolean existsAppUserByEmail(String email);
	Optional<AppUser> findByEmail(String email);
	Optional<AppUser> findByRefreshToken(String refreshToken);
}
