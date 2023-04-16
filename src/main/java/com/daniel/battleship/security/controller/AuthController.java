package com.daniel.battleship.security.controller;

import java.util.Objects;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.daniel.battleship.security.dto.AuthenticationRequest;
import com.daniel.battleship.security.dto.AuthenticationResponse;
import com.daniel.battleship.security.dto.RefreshTokenRequest;
import com.daniel.battleship.security.dto.RegisterRequest;
import com.daniel.battleship.security.service.AuthenticationService;
import com.daniel.battleship.util.Endpoint;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping(Endpoint.VERSION + Endpoint.Auth.ROOT)
@Tag(name = "Authentication Controller", description = "Controlador encargado de las operaciones de sesión del usuario")
@RequiredArgsConstructor
@CrossOrigin
public class AuthController {

	private final AuthenticationService service;

	@PostMapping(Endpoint.Auth.SIGNUP)
	@Operation(description = "Registrar nuevo usuario")
	@ApiResponse(description = "Crea un nuevo usuario en BBDD y devuelve sus tokens de acceso")
	public ResponseEntity<AuthenticationResponse> register(@RequestBody RegisterRequest request) {
		return ResponseEntity.ok(service.register(request));
	}

	@PostMapping(Endpoint.Auth.SIGNIN)
	@Operation(description = "Iniciar sesión")
	@ApiResponse(description = "Solicita credenciales de usuario y devuelve sus tokens de acceso")
	public ResponseEntity<AuthenticationResponse> authenticate(@RequestBody AuthenticationRequest request) {
		return ResponseEntity.ok(service.authenticate(request));
	}
	
	@PostMapping(Endpoint.Auth.REFRESH_TOKEN)
	@Operation(description = "Refrescar token de acceso")
	@ApiResponse(description = "Solicita el token de refresco del usuario, y devuelve sus tokens de acceso actualizados")
	public ResponseEntity<AuthenticationResponse> refreshToken(@RequestBody RefreshTokenRequest request) {
		AuthenticationResponse response = service.refreshToken(request);
		if (Objects.isNull(response)) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
		}
		return ResponseEntity.ok(response);
	}

}
