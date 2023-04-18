import React, { FC } from 'react';
import styles from './MyGames.module.css';
import client from '../../api/client';
import { GameDomain, GameState } from '../../api/domain/GameDomain';
import { ENDPOINT_GET_MY_GAMES } from '../../utils/Endpoints';
import { toast } from 'react-toastify';
import { useAppDispatch } from '../../hooks/reduxHooks';
import { hideSpinner, showSpinner } from '../../store/slices/SpinnerSlice';
import { formatDate } from '../../utils/Utils';
import { Link } from 'react-router-dom';
import {
  PATH_GAME,
  PATH_PREPARE_BOARD,
  passParameters,
} from '../../Routes';
import { useTranslation } from 'react-i18next';

interface MyGamesProps {}

const MyGames: FC<MyGamesProps> = () => {
  const {t} = useTranslation();
  const [games, setGames] = React.useState<GameDomain[]>([]);
  const dispatch = useAppDispatch();

  React.useEffect(() => {
    dispatch(showSpinner());
    client
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
      });
  }, [t, dispatch]);

  return (
    <div className={styles.MyGames}>
      <p className='title'>{t('myGames.title')}</p>
      <table className={`${styles.Score} table table-striped`}>
        <thead>
          <tr>
            <th scope='col' className='text-capitalize'>{t('myGames.result')}</th>
            <th scope='col' className='text-capitalize'>{t('myGames.opponent')}</th>
            <th scope='col' className='text-capitalize'>{t('myGames.date')}</th>
            <th scope='col' className='text-capitalize'>{t('myGames.points')}</th>
            <th scope='col' className='text-capitalize'>{t('myGames.actions.title')}</th>
          </tr>
        </thead>
        <tbody className=''>
          {games.length === 0 ? (
            <tr>
              <th className='text-center' colSpan={5}>
                {t('myGames.noGames')}
              </th>
            </tr>
          ) : (
            games.map((game) => (
              <tr key={game.id + '-tr'}>
                <th className='text-uppercase'>{t('myGames.gameStates.'+game.board1.state.toLowerCase())}</th>
                <td>{game.board2.owner.nickname}</td>
                <td>{formatDate(game.createdAt)}</td>
                <td>0</td>
                <td>
                  <Link
                  className='text-uppercase'
                    to={
                      +GameState[game.state] === GameState.CREATED
                        ? passParameters(PATH_PREPARE_BOARD, game.board1.code)
                        : passParameters(PATH_GAME, game.code)
                    }
                  >
                    {+GameState[game.state] === GameState.FINALIZED
                      ? t('myGames.actions.see')
                      : t('myGames.actions.access')}
                  </Link>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default MyGames;
