package com.daniel.battleship.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class History {

	@Id
	@GeneratedValue
	private Long id;

	@ManyToOne
	private Game game;
	
	@ManyToOne
	private AppUser player;
	
	@ManyToOne(optional = true)
	private Box box;
	
	@ManyToOne(optional = true)
	private EmptyBox emptyBox;
	
	
}
