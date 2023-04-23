import { ENDPOINT_GET_CURRENT_GAME, ENDPOINT_GET_MY_GAMES } from '../../utils/Endpoints';
import client from '../client';
import { GameDomain } from '../domain/GameDomain';

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

/*client
      .get<GameDomain[]>(ENDPOINT_GET_MY_GAMES)
      .then((response) => {
        dispatch(hideSpinner());
        setGames(
          response.data.sort((a, b) => {
            const dateA = new Date(b.createdAt);
            const dateB = new Date(a.createdAt);
            return dateA > dateB ? 1 : dateA < dateB ? -1 : 0;
          })
        );
      })
      .catch((err) => {
        console.error(err);
        dispatch(hideSpinner());
        toast.error(t('myGames.notFoundGames'), {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'light',
        });
      }); */