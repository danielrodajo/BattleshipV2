package com.daniel.battleship.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.daniel.battleship.dto.UserDTO;
import com.daniel.battleship.entity.AppUser;
import com.daniel.battleship.mapper.UserMapper;
import com.daniel.battleship.service.PlayerService;
import com.daniel.battleship.util.Endpoint;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@CrossOrigin
@RestController
@RequestMapping(Endpoint.VERSION + Endpoint.User.ROOT)
@Tag(name = "User Controller", description = "Controlador para las operaciones relacionadas con los datos de usuario")
@RequiredArgsConstructor
public class UserController {

	private final PlayerService playerService;
	private final UserMapper mapper;
	
	@GetMapping
	@Operation(description = "Datos de usuario")
	@ApiResponse(description = "Devuelve los datos del usuario logueado")
	public ResponseEntity<UserDTO> getUserData() {
		AppUser user = this.playerService.getUserData();
		return ResponseEntity.ok(mapper.toDTO(user));
	}
}
