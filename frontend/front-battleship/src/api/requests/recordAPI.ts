import { ENDPOINT_GET_GAME_RECORDS } from '../../utils/Endpoints';
import client from '../client';
import { RecordDomain } from '../domain/RecordDomain';

export const fetchGameRecords = async (
  gameCode: string
): Promise<RecordDomain[]> => {
  const response = await client.get<RecordDomain[]>(ENDPOINT_GET_GAME_RECORDS, {
    params: { gameCode: gameCode },
  });
  return response.data;
};
