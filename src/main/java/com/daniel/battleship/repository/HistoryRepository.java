package com.daniel.battleship.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import com.daniel.battleship.entity.History;

public interface HistoryRepository extends JpaRepository<History, Long>, JpaSpecificationExecutor<History> {


}
