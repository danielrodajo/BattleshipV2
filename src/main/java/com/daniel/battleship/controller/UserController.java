package com.daniel.battleship.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.daniel.battleship.dto.RankingDTO;
import com.daniel.battleship.dto.UserDTO;
import com.daniel.battleship.entity.AppUser;
import com.daniel.battleship.mapper.UserMapper;
import com.daniel.battleship.service.GameService;
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
	private final GameService gameService;

	@GetMapping
	@Operation(description = "Datos de usuario")
	@ApiResponse(description = "Devuelve los datos del usuario logueado")
	public ResponseEntity<UserDTO> getUserData() {
		AppUser user = this.playerService.getUserData();
		return ResponseEntity.ok(mapper.toDTO(user));
	}

	@GetMapping(Endpoint.User.GET_USERS_SCORE)
	@Operation(description = "Obtener el ranking")
	@ApiResponse(description = "Devuelve listado de usuarios en el ranking")
	public ResponseEntity<List<RankingDTO>> getUsersRanking() {
		List<AppUser> users = this.playerService.getAll();
		List<RankingDTO> rankings = users.stream().map(u -> RankingDTO.builder().nickname(u.getNickname())
				.points(u.getPoints()).games(gameService.getUserGames(u.getEmail()).size()).build())
				.collect(Collectors.toList());
		return ResponseEntity.ok(rankings);
	}

	@GetMapping(Endpoint.User.GET_USER_POINTS)
	@Operation(description = "Obtener puntos del usuario")
	@ApiResponse(description = "Devuelve los puntos del usuario logueado")
	public ResponseEntity<Long> getUserPoints() {
		AppUser user = this.playerService.getUserData();
		return ResponseEntity.ok(user.getPoints());
	}
}
