package com.daniel.battleship.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import com.daniel.battleship.entity.Box;

public interface BoxRepository extends JpaRepository<Box, Long>, JpaSpecificationExecutor<Box> {
	
}
