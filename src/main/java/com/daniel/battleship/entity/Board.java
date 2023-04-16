package com.daniel.battleship.entity;

import java.util.List;

import com.daniel.battleship.enums.BoardState;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class Board {

	@Id
	@GeneratedValue(strategy = GenerationType.SEQUENCE)
	private Long id;
	
	@Column(nullable = false, unique = true)
	private String code;
	
	@Column
	private Integer width;
	
	@Column
	private Integer height;
	
	@OneToOne
	private AppUser owner;
	
	@OneToMany(fetch = FetchType.EAGER)
	private List<Box> boxes;
	
	@OneToMany(fetch = FetchType.EAGER)
	private List<EmptyBox> emptyBoxes;
	
	@Enumerated(EnumType.STRING)
	private BoardState state;
}
