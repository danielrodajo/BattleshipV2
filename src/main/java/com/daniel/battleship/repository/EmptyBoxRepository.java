package com.daniel.battleship.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import com.daniel.battleship.entity.EmptyBox;

public interface EmptyBoxRepository extends JpaRepository<EmptyBox, Long>, JpaSpecificationExecutor<EmptyBox> {
	
}
