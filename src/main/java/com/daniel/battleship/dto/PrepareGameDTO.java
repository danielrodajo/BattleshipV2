package com.daniel.battleship.dto;

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
public class PrepareGameDTO {

	private Integer size;
	private Integer carriers;
	private Integer battleships;
	private Integer submarines;
	private Integer destroyers;
	
}