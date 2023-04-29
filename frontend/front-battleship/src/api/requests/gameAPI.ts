import {
  ENDPOINT_GET_CURRENT_GAME,
  ENDPOINT_GET_MY_GAMES,
  ENDPOINT_JOIN_GAME,
  ENDPOINT_PREPARE_GAME,
} from '../../utils/Endpoints';
import client from '../client';
import { GameDomain } from '../domain/GameDomain';
import { InvitationDomain } from '../domain/InvitationDomain';
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

export const prepareGame = async (
  data: PrepareGameRequest
): Promise<InvitationDomain> => {
  const response = await client.post<InvitationDomain>(
    ENDPOINT_PREPARE_GAME,
    data
  );
  return response.data;
};

export const joinGame = async (invitationCode: string): Promise<string> => {
  const response = await client.get<string>(ENDPOINT_JOIN_GAME, {
    params: { code: invitationCode },
  });
  return response.data;
};
