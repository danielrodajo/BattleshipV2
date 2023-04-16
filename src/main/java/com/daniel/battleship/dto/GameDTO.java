package com.daniel.battleship.dto;

import java.util.Date;

import com.daniel.battleship.enums.GameState;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(Include.NON_NULL)
public class GameDTO {

	private Long id;
	private String code;
	private BoardDTO board1;
	private BoardDTO board2;	
	private Long turn;
	private GameState state;
	private Date createdAt;
	
}
