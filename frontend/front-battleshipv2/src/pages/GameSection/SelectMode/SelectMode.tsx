import React, { FC } from 'react';
import styles from './SelectMode.module.css';
import GameMode from '../../../components/GameMode/GameMode';
import { ThreeDots } from 'react-loader-spinner';
import { EventSourcePolyfill } from 'event-source-polyfill';
import { useAppSelector } from '../../../hooks/reduxHooks';
import { selectAuthToken } from '../../../store/slices/AuthSlice';
import { useNavigate } from 'react-router-dom';
import { PATH_PREPARE_BOARD, passParameters } from '../../../utils/Routes';
import client from '../../../api/client';
import {
  ENDPOINT_GAME_SEARCHING,
  ENDPOINT_GET_BOARD_BY_GAME,
} from '../../../utils/Endpoints';
import { useTranslation } from 'react-i18next';

interface SelectModeProps {}

const SelectMode: FC<SelectModeProps> = () => {
  const { t } = useTranslation();
  const [searching, setSearching] = React.useState(false);
  const [sse, setSse] = React.useState<EventSourcePolyfill>();
  const token = useAppSelector(selectAuthToken);
  const navigate = useNavigate();

  React.useEffect(() => {
    return () => {
      if (sse) {
        setSearching(false);
        sse.close();
      }
    };
  }, [sse]);

  const searchOnline = () => {
    const eventSource = new EventSourcePolyfill(
      `${process.env.REACT_APP_API_URL}${ENDPOINT_GAME_SEARCHING}`,
      {
        headers: {
          Authorization: `Bearer ${token!}`,
        },
      }
    );

    setSearching(true);
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

  const addSpan = (text: any) => {
    return [...text].map((letter, i) => (
      <span key={`${letter}-${i}`}>{letter}</span>
    ));
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

  return (
    <div className={`${styles.SelectMode} container h-100`}>
      {/*       <button onClick={handleSSE}>SSE</button> */}
      {searching ? (
        <div className=' h-100 d-flex justify-content-center align-items-center'>
          <div className='container'>
            <div className='row'>
              <div className={`col-12 text-center ${styles.TextSpinner}`}>
                {addSpan(t('selectGame.searching'))}
              </div>
            </div>
            <div className='row'>
              <div className='col-12 d-flex justify-content-center align-items-center'>
                <ThreeDots
                  height='80'
                  width='80'
                  radius='9'
                  color='#6e30b4'
                  ariaLabel='three-dots-loading'
                  wrapperStyle={{}}
                  visible={true}
                />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className='h-100 row'>
          <div className='col-6 d-flex justify-content-center align-items-center'>
            <GameMode
              title={t('selectGame.online.text')}
              bodyLines={onlineText}
              playButton={t('selectGame.online.btn')}
              handlePlay={searchOnline}
            />
          </div>
          <div className='col-6 d-flex justify-content-center align-items-center'>
            <GameMode
              title={t('selectGame.offline.text')}
              bodyLines={offlineText}
              playButton={t('selectGame.offline.btn')}
              handlePlay={() => console.log('OFFLINE')}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default SelectMode;
