package com.daniel.battleship.entity;

import java.util.Date;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
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
public class Invitation {

	@Id
	@GeneratedValue(strategy = GenerationType.SEQUENCE)
	private Long id;
	
	@Column(nullable = false)
	private String code;

	@OneToOne(optional = false)
	private Game game;

	@OneToOne(optional = true)
	private AppUser receiver;
	
	@Column(nullable = false)
	private Date createdAt;

	@Column(nullable = false)
	private Date expiredAt;
	
}
