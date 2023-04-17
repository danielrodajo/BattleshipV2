package com.daniel.battleship.dto;

import java.util.Date;

import com.daniel.battleship.enums.RecordType;
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
public class RecordDTO {

	private Long id;
	private UserDTO player;
	private GameDTO game;
	private Integer x;
	private Integer y;
	private RecordType type;
	private Date createdAt;
	
}
