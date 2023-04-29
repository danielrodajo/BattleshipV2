package com.daniel.battleship.validators;

import java.util.Date;

import org.springframework.stereotype.Service;

import com.daniel.battleship.entity.Invitation;
import com.daniel.battleship.repository.InvitationRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@Service
@RequiredArgsConstructor
@Log4j2
public class InvitationValidator {
	
	private final InvitationRepository repository;

	
	public void validateInvitation(Invitation invitation) {
		Date currentDate = new Date();
		if (invitation.getCreatedAt().after(currentDate) || invitation.getExpiredAt().before(currentDate)) {
			throw new IllegalArgumentException("La invitación no es válida");
			
		}
	}
	
}
