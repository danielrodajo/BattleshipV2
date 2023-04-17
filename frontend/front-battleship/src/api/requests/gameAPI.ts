import { ENDPOINT_GET_CURRENT_GAME } from '../../utils/Endpoints';
import client from '../client';
import { GameDomain } from '../domain/GameDomain';

export const fetchGame = async (gameCode: string): Promise<GameDomain> => {
  const response = await client.get<GameDomain>(ENDPOINT_GET_CURRENT_GAME, {
    params: { code: gameCode },
  });
  return response.data;
};
