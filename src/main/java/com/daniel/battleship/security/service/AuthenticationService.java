package com.daniel.battleship.security.service;

import java.security.Principal;
import java.util.Objects;

import javax.management.openmbean.KeyAlreadyExistsException;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.daniel.battleship.entity.AppUser;
import com.daniel.battleship.enums.Role;
import com.daniel.battleship.repository.UserRepository;
import com.daniel.battleship.security.dto.AuthenticationRequest;
import com.daniel.battleship.security.dto.AuthenticationResponse;
import com.daniel.battleship.security.dto.RefreshTokenRequest;
import com.daniel.battleship.security.dto.RegisterRequest;

import io.jsonwebtoken.ExpiredJwtException;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@Service
@RequiredArgsConstructor
@Log4j2
public class AuthenticationService {

	private final UserRepository repository;
	private final PasswordEncoder passwordEncoder;
	private final JwtService jwtService;
	private final AuthenticationManager authenticationManager;

	public AuthenticationResponse register(RegisterRequest request) {
		if (repository.existsByEmail(request.getEmail())) {
			log.error("Ya existe un usuario con este email");
			throw new KeyAlreadyExistsException("email");
		}
		if (repository.existsByNickname(request.getNickname())) {
			log.error("Ya existe un usuario con este apodo");
			throw new KeyAlreadyExistsException("nickname");
		}
		var user = AppUser.builder().name(request.getName()).firstsurname(request.getFirstsurname())
				.secondsurname(request.getSecondsurname()).email(request.getEmail())
				.nickname(request.getNickname())
				.password(passwordEncoder.encode(request.getPassword())).role(Role.USER).build();
		String refreshToken = jwtService.generateRefreshToken(user);
		user.setRefreshToken(refreshToken);
		repository.save(user);
		String jwtToken = jwtService.generateToken(user);
		return AuthenticationResponse.builder().token(jwtToken).refreshToken(refreshToken).build();
	}

	public AuthenticationResponse authenticate(AuthenticationRequest request) {
		try {
			this.authenticationManager
					.authenticate(new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));
		} catch (BadCredentialsException e) {
			throw new BadCredentialsException("Credenciales incorrectas");
		}
		var user = repository.findByEmail(request.getEmail()).orElseThrow();
		String refreshToken = jwtService.generateRefreshToken(user);
		user.setRefreshToken(refreshToken);
		repository.save(user);
		var jwtToken = jwtService.generateToken(user);
		return AuthenticationResponse.builder().token(jwtToken).refreshToken(refreshToken).build();
	}

	public AuthenticationResponse refreshToken(RefreshTokenRequest request) {
		String refreshToken = request.getToken();
		AppUser user = repository.findByRefreshToken(refreshToken).orElse(null);
		if (Objects.nonNull(user) && jwtService.isTokenValid(refreshToken, user)) {
			UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(user, null,
					user.getAuthorities());
			SecurityContextHolder.getContext().setAuthentication(authToken);
			var jwtToken = jwtService.generateToken(user);
			return AuthenticationResponse.builder().token(jwtToken).refreshToken(refreshToken).build();
		}
		return null;
	}
	
	public Principal authenticateThroughWebSocket(String jwt) {
		if (jwtService.isTokenExpired(jwt)) {
			throw new ExpiredJwtException(null, null, jwt);
		}
		String username = jwtService.getSubject(jwt);
		var user = repository.findByEmail(username).orElseThrow();
		UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(user, null,
				user.getAuthorities());
		SecurityContextHolder.getContext().setAuthentication(authToken);
		return SecurityContextHolder.getContext().getAuthentication();
	}

}
