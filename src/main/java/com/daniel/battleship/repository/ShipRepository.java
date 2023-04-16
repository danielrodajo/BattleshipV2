package com.daniel.battleship.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import com.daniel.battleship.entity.Ship;

public interface ShipRepository extends JpaRepository<Ship, Long>, JpaSpecificationExecutor<Ship> {

}
