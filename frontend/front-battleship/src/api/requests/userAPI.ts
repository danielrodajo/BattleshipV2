import { ENDPOINT_USERS_RANKING, ENDPOINT_USER_POINTS } from '../../utils/Endpoints';
import client from '../client';
import { RankingResponse } from '../domain/requests/RankingResponse';

export const fetchUsersRanking = async (): Promise<RankingResponse[]> => {
  const response = await client.get<RankingResponse[]>(ENDPOINT_USERS_RANKING);
  return response.data;
};

export const fetchUserPoints = async (): Promise<number> => {
  const response = await client.get<number>(ENDPOINT_USER_POINTS);
  return response.data;
};
