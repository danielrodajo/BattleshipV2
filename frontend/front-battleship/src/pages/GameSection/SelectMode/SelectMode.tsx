import React, { FC } from 'react';
import styles from './SelectMode.module.css';
import GameMode from '../../../components/GameMode/GameMode';
import { ThreeDots } from 'react-loader-spinner';
import { EventSourcePolyfill } from 'event-source-polyfill';
import { useAppSelector } from '../../../hooks/reduxHooks';
import { selectAuthToken } from '../../../store/slices/AuthSlice';
import { useNavigate } from 'react-router-dom';
import {
  PATH_CUSTOMIZE_GAME,
  PATH_PREPARE_BOARD,
  passParameters,
} from '../../../Routes';
import client from '../../../api/client';
import {
  ENDPOINT_GAME_SEARCHING,
  ENDPOINT_GET_BOARD_BY_GAME,
} from '../../../utils/Endpoints';
import { useTranslation } from 'react-i18next';
import SearchingGame from '../../../components/SearchingGame/SearchingGame';

interface SelectModeProps {}

const SelectMode: FC<SelectModeProps> = () => {
  const { t } = useTranslation();
  const [searching, setSearching] = React.useState(false);
  const [sse, setSse] = React.useState<EventSourcePolyfill | null>();
  const token = useAppSelector(selectAuthToken);
  const navigate = useNavigate();

  React.useEffect(() => {
    return () => {
      disconnect();
    };
  }, [sse]);

  const disconnect = () => {
    if (sse) {
      setSearching(false);
      sse.close();
      setSse(null);
    }
  };

  const searchOnline = () => {
    setSearching(true);
    const eventSource = new EventSourcePolyfill(
      `${process.env.REACT_APP_API_URL}${ENDPOINT_GAME_SEARCHING}`,
      {
        headers: {
          Authorization: `Bearer ${token!}`,
        },
      }
    );

    setSse(eventSource);

    eventSource.onmessage = (e) => console.log(e);
    eventSource.addEventListener('game', async (e: any) => {
      eventSource.close();
      const response = await client.get(ENDPOINT_GET_BOARD_BY_GAME, {
        params: { id: e.data },
      });
      setSearching(false);
      navigate(passParameters(PATH_PREPARE_BOARD, response.data.code));
    });
    eventSource.onerror = (e) => {
      // error log here
      console.error(e);
      setSearching(false);
      eventSource.close();
    };
  };

  const onlineText = [
    t('selectGame.online.features.points'),
    t('selectGame.online.features.vsplayers'),
    t('selectGame.online.features.limitround'),
    t('selectGame.online.features.sizetable'),
  ];
  const offlineText = [
    t('selectGame.offline.features.points'),
    t('selectGame.offline.features.vsplayers'),
    t('selectGame.offline.features.limitround'),
    t('selectGame.offline.features.sizetable'),
  ];
  const friendsText = [
    t('selectGame.friends.features.points'),
    t('selectGame.friends.features.vsplayers'),
    t('selectGame.friends.features.limitround'),
    t('selectGame.friends.features.sizetable'),
  ];

  return (
    <div className={`${styles.SelectMode} container h-100`}>
      <SearchingGame searching={searching} disconnect={disconnect} />
      <div
        className={`${styles.SelectGameContainer} ${!searching && styles.show}`}
      >
        <div className='d-flex justify-content-center align-items-center'>
          <GameMode
            title={t('selectGame.friends.text')}
            bodyLines={friendsText}
            playButton={t('selectGame.friends.btn')}
            handlePlay={() => navigate(PATH_CUSTOMIZE_GAME)}
          />
        </div>
        <div className='d-flex justify-content-center align-items-center'>
          <GameMode
            title={t('selectGame.online.text')}
            bodyLines={onlineText}
            playButton={t('selectGame.online.btn')}
            handlePlay={() =>searchOnline()}
          />
        </div>
        <div className='d-flex justify-content-center align-items-center'>
          <GameMode
            title={t('selectGame.offline.text')}
            bodyLines={offlineText}
            playButton={t('selectGame.offline.btn')}
            handlePlay={() => console.log('OFFLINE')}
          />
        </div>
      </div>
    </div>
  );
};

export default SelectMode;
