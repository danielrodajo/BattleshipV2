package com.daniel.battleship.config;

import javax.management.openmbean.KeyAlreadyExistsException;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import lombok.extern.log4j.Log4j2;

@RestControllerAdvice
@Log4j2
public class ResponseExceptionHandler {

	@ExceptionHandler(BadCredentialsException.class)
	public ResponseEntity<Object> exceptionHandler(BadCredentialsException e) {
		log.error("BadCredentialsException: ", e);
		return new ResponseEntity<>(e.getMessage(), HttpStatus.UNAUTHORIZED);
	}

	@ExceptionHandler(KeyAlreadyExistsException.class)
	public ResponseEntity<Object> exceptionHandler(KeyAlreadyExistsException e) {
		log.error("KeyAlreadyExistsException: ", e);
		return new ResponseEntity<>(e.getMessage(), HttpStatus.CONFLICT);
	}

	@ExceptionHandler(Exception.class)
	public ResponseEntity<Object> exceptionHandler(Exception e) {
		log.error("Exception: ", e);
		return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
	}
	
}
