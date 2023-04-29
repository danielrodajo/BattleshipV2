package com.daniel.battleship.service.impl;

import java.util.Calendar;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.daniel.battleship.entity.Game;
import com.daniel.battleship.entity.Invitation;
import com.daniel.battleship.repository.InvitationRepository;
import com.daniel.battleship.service.InvitationService;
import com.daniel.battleship.util.Utils;
import com.daniel.battleship.validators.InvitationValidator;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class InvitationServiceImpl implements InvitationService {

	@Value("${invitation.expired_days}")
	private Integer EXPIRED_DAYS;

	private final InvitationRepository repository;
	private final InvitationValidator validator;

	@Override
	public Invitation save(Invitation item) {
		return repository.save(item);
	}

	@Override
	public Invitation update(Invitation item) {
		return repository.save(item);
	}

	@Override
	public void delete(Invitation item) {
		// TODO Auto-generated method stub

	}

	@Override
	public Invitation getById(Long id) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public List<Invitation> getAll() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public Invitation getByCode(String code) {
		var invitation = repository.findByCode(code).orElseThrow();
		validator.validateInvitation(invitation);
		return invitation;
	}

	@Override
	public Invitation createByGame(Game game) {
		Calendar calendar = Calendar.getInstance();
		calendar.add(Calendar.DAY_OF_MONTH, EXPIRED_DAYS);
		var expiredAt = calendar.getTime();
		var invitation = Invitation.builder().game(game).code(Utils.generateCode()).createdAt(new Date())
				.expiredAt(expiredAt).build();
		return this.save(invitation);
	}

}
