package com.daniel.battleship.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.daniel.battleship.dto.RecordDTO;
import com.daniel.battleship.mapper.RecordMapper;
import com.daniel.battleship.service.RecordService;
import com.daniel.battleship.util.Endpoint;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import com.daniel.battleship.entity.Record;

@RestController
@RequestMapping(Endpoint.VERSION + Endpoint.Record.ROOT)
@Tag(name = "Record Controller", description = "Controlador para las operaciones relacionadas con el manejo del historial de las partidas")
@RequiredArgsConstructor
public class RecordController {

	private final RecordService recordService;
	private final RecordMapper mapper;


	@GetMapping(Endpoint.Record.GET_GAME_RECORDS)
	@Operation(description = "Obtiene el historial de una partida")
	@ApiResponse(description = "Historial obtenido")
	public ResponseEntity<List<RecordDTO>> getGameRecords(String gameCode) {
		List<Record> records = recordService.getGameRecords(gameCode);
		return ResponseEntity.ok(mapper.toListDTO(records));
	}
}
