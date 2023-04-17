package com.daniel.battleship.security.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RegisterRequest {

	private String name;
	private String firstsurname;
	private String secondsurname;
	private String nickname;
	private String email;
	private String password;

}
