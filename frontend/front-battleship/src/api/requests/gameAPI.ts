import { ENDPOINT_GET_CURRENT_GAME, ENDPOINT_GET_MY_GAMES, ENDPOINT_PREPARE_GAME } from '../../utils/Endpoints';
import client from '../client';
import { GameDomain } from '../domain/GameDomain';
import { PrepareGameRequest } from '../domain/requests/PrepareGameRequest';

export const fetchGame = async (gameCode: string): Promise<GameDomain> => {
  const response = await client.get<GameDomain>(ENDPOINT_GET_CURRENT_GAME, {
    params: { code: gameCode },
  });
  return response.data;
};

export const fetchMyGames = async (): Promise<GameDomain[]> => {
  const response = await client.get<GameDomain[]>(ENDPOINT_GET_MY_GAMES);
  return response.data;
};

export const prepareGame = async (data: PrepareGameRequest): Promise<GameDomain> => {
  const response = await client.post<GameDomain>(ENDPOINT_PREPARE_GAME, data);
  return response.data;
};