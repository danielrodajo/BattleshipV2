package com.daniel.battleship.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import com.daniel.battleship.entity.Board;

public interface BoardRepository extends JpaRepository<Board, Long>, JpaSpecificationExecutor<Board> {

	Optional<Board> findByCode(String code);
	Boolean existsBoardByCode(String code);

}
