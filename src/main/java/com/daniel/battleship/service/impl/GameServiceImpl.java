package com.daniel.battleship.service.impl;

import java.util.Date;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.Random;
import java.util.stream.Collectors;

import org.springframework.data.util.Pair;
import org.springframework.stereotype.Service;

import com.daniel.battleship.dto.PrepareGameDTO;
import com.daniel.battleship.entity.AppUser;
import com.daniel.battleship.entity.Board;
import com.daniel.battleship.entity.Game;
import com.daniel.battleship.enums.BoardState;
import com.daniel.battleship.enums.GameState;
import com.daniel.battleship.repository.GameRepository;
import com.daniel.battleship.service.GameService;
import com.daniel.battleship.service.PlayerService;
import com.daniel.battleship.util.Utils;
import com.daniel.battleship.validators.GameValidator;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class GameServiceImpl implements GameService {

	private final Integer DEFAULT_SIZE = 10;

	private final GameRepository gameRepository;
	private final GameValidator gameValidator;
	private final PlayerService playerService;

	@Override
	public Game save(Game game) {
		gameValidator.validateSaveGame(game);
		game.setCreatedAt(new Date());
		return this.gameRepository.save(game);
	}

	@Override
	public Game update(Game game) {
		gameValidator.validateUpdateGame(game);
		return this.gameRepository.save(game);
	}

	@Override
	public void delete(Game game) {
		this.delete(game);
	}

	@Override
	public Game getById(Long id) {
		return this.gameRepository.findById(id).orElseThrow();
	}

	@Override
	public Game getGameByCode(String code) {
		return this.gameRepository.findByCode(code).orElseThrow();
	}

	@Override
	public List<Game> getAll() {
		return this.gameRepository.findAll();
	}

	@Override
	public List<Game> getMyGames() {
		var games = this.getUserGames(Utils.getCurrentUsername());
		// games = games.stream().filter(game ->
		// !game.getState().equals(GameState.PREPARING)).collect(Collectors.toList());
		games.forEach(game -> {
			game.getBoard1().setBoxes(null);
			game.getBoard1().setEmptyBoxes(null);
			if (Objects.nonNull(game.getBoard2())) {
				Utils.filterBoardData(game.getBoard2());
			}
		});
		return games;
	}

	@Override
	public Game createGame(Pair<String, String> namePlayers) {
		AppUser player1 = playerService.getByEmail(namePlayers.getFirst());
		AppUser player2 = playerService.getByEmail(namePlayers.getSecond());

		Game game = Game.builder().code(Utils.generateCode())
				.board1(Board.builder().code(Utils.generateCode()).width(DEFAULT_SIZE).height(DEFAULT_SIZE)
						.state(BoardState.CREATED).owner(player1).build())
				.board2(Board.builder().code(Utils.generateCode()).width(DEFAULT_SIZE).height(DEFAULT_SIZE)
						.state(BoardState.CREATED).owner(player2).build())
				.state(GameState.CREATED).build();

		return this.save(game);
	}

	@Override
	public Game initGame(Game game) {
		game.setState(GameState.IN_PROGRESS);
		Random r = new Random();
		int choice = r.nextInt(2);
		game.setTurn(choice == 0 ? game.getBoard1().getId() : game.getBoard2().getId());
		return this.update(game);
	}

	@Override
	public Game getCurrentGame(String code) {
		Game game = this.getGameByCode(code);
		limitData(game);
		return game;
	}

	private void limitData(Game game) {
		String username = Utils.getCurrentUsername();
		Board opponentBoard = null;
		if (game.getBoard1().getOwner().getEmail().equals(username)) {
			opponentBoard = game.getBoard2();
		} else if (game.getBoard2().getOwner().getEmail().equals(username)) {
			opponentBoard = game.getBoard1();
			game.setBoard1(game.getBoard2());
			game.setBoard2(opponentBoard);
		} else {
			throw new IllegalArgumentException("No tienes esta partida registrada");
		}

		if (Objects.nonNull(opponentBoard)) {
			if (!game.getState().equals(GameState.FINALIZED)) {
				opponentBoard.setBoxes(
						opponentBoard.getBoxes().stream().filter(box -> box.getTouched()).collect(Collectors.toList()));
			}
			opponentBoard.setOwner(AppUser.builder().nickname(opponentBoard.getOwner().getNickname()).build());
		}

	}

	@Override
	public Optional<Game> getGameByBoard1Code(String code) {
		return gameRepository.findGameByBoard1Code(code);
	}

	@Override
	public Optional<Game> getGameByBoard2Code(String code) {
		return gameRepository.findGameByBoard2Code(code);
	}

	@Override
	public Game nextTurn(Game game) {
		game.setTurn(
				game.getTurn().equals(game.getBoard1().getId()) ? game.getBoard2().getId() : game.getBoard1().getId());

		return this.update(game);
	}

	@Override
	public Game finishGame(Game game, Board winner) {
		if (game.getBoard1().getId().equals(winner.getId())) {
			game.getBoard1().setState(BoardState.WIN);
			game.getBoard2().setState(BoardState.LOSE);
		} else if (game.getBoard2().getId().equals(winner.getId())) {
			game.getBoard2().setState(BoardState.WIN);
			game.getBoard1().setState(BoardState.LOSE);
		} else {
			throw new IllegalArgumentException("La mesa no corresponde con la partida");
		}
		game = this.calculateAndUpdatePoints(game);
		game.setState(GameState.FINALIZED);
		return this.update(game);
	}

	private Game calculateAndUpdatePoints(Game game) {
		Long points = Utils.calculatePoints(game);
		var winnerBoard = game.getBoard1().getState().equals(BoardState.WIN) ? game.getBoard1() : game.getBoard2();
		var looserBoard = game.getBoard1().getState().equals(BoardState.WIN) ? game.getBoard2() : game.getBoard1();
		playerService.addPoints(points, winnerBoard.getOwner());
		playerService.addPoints(points * -1, looserBoard.getOwner());
		game.setPoints(points);
		return game;
	}

	@Override
	public List<Game> getUserGames(String email) {
		List<Game> games = this.gameRepository.findByBoard1OwnerEmail(email);
		List<Game> games2 = this.gameRepository.findByBoard2OwnerEmail(email);
		games2.forEach(g -> {
			var auxBoard = g.getBoard1();
			g.setBoard1(g.getBoard2());
			g.setBoard2(auxBoard);
		});
		games.addAll(games2);
		return games;
	}

	@Override
	public Game prepareGame(PrepareGameDTO dto) {
		Game game = Game.builder().code(Utils.generateCode()).state(GameState.PREPARING)
				.board1(Board.builder().code(Utils.generateCode()).width(dto.getSize()).height(dto.getSize())
						.state(BoardState.PREPARING).owner(playerService.getUserData()).build())
				.build();
		return save(game);
	}

	@Override
	public Game joinGame(String code) {
		Game game = this.getGameByCode(code);
		this.gameValidator.validateJoinGame(game);

		game.setBoard2(Board.builder().code(Utils.generateCode()).width(game.getBoard1().getWidth())
				.height(game.getBoard1().getHeight()).state(BoardState.CREATED).owner(playerService.getUserData())
				.build());
		game.getBoard1().setState(BoardState.CREATED);
		game.setState(GameState.CREATED);

		return this.update(game);
	}
}
