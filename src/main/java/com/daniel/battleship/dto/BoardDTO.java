package com.daniel.battleship.dto;

import java.util.List;

import com.daniel.battleship.enums.BoardState;
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
public class BoardDTO {
	
	private Long id;
	private String code;
	private UserDTO owner;
	private Integer width;
	private Integer height;
	private List<BoxDTO> boxes;
	private List<EmptyBoxDTO> emptyBoxes;
	private BoardState state;
	
}
