package com.daniel.battleship.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import com.daniel.battleship.entity.Game;

public interface GameRepository extends JpaRepository<Game, Long>, JpaSpecificationExecutor<Game> {

	Optional<Game> findByCode(String code);

	Optional<Game> findGameByBoard1Code(String code);

	Optional<Game> findGameByBoard2Code(String code);

	List<Game> findByBoard1OwnerEmail(String email);

	List<Game> findByBoard2OwnerEmail(String email);

	boolean existsByCode(String code);

}
