package com.daniel.battleship.entity;

import java.util.Date;

import com.daniel.battleship.enums.GameState;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToOne;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@EqualsAndHashCode(exclude = {"board1", "board2", "turn", "state"})
public class Game {

	@Id
	@GeneratedValue(strategy = GenerationType.SEQUENCE)
	private Long id;
	
	@Column(nullable = false, unique = true)
	private String code;

	@OneToOne(cascade=CascadeType.ALL)
	private Board board1;

	@OneToOne(cascade=CascadeType.ALL)
	private Board board2;
	
	@Column
	private Long turn;
	
	@Enumerated(EnumType.STRING)
	private GameState state;
	
	@Column(nullable = true)
	private Long points;
	
	@Column
	private Date createdAt;

}
