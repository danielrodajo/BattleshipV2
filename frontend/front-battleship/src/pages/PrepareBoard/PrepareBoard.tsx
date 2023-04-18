import React, { FC } from 'react';
import styles from './PrepareBoard.module.css';
import { useNavigate, useParams } from 'react-router-dom';
import client from '../../api/client';
import {
  ENDPOINT_GAME_WAITING,
  ENDPOINT_GET_BOARD_BY_CODE,
  ENDPOINT_INIT_BOARD,
} from '../../utils/Endpoints';
import { BoardDomain } from '../../api/domain/BoardDomain';
import {
  PATH_GAME,
  PATH_HOME,
  passParameters,
} from '../../Routes';
import carrier from '../../assets/carrier.png';
import Ship from '../../components/Ship/Ship';
import Board from '../../components/Board/Board';
import { ShipData } from '../../api/data/ShipData';
import FleetGenerator from '../../services/FleetGenerator';
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks';
import { hideSpinner, showSpinner } from '../../store/slices/SpinnerSlice';
import { toast } from 'react-toastify';
import {
  mapBoxShipsDataToDomain,
  mapBoxShipsDomainToData,
} from '../../api/mappers/BoxShipMapper';
import { EventSourcePolyfill } from 'event-source-polyfill';
import { selectAuthToken } from '../../store/slices/AuthSlice';
import { useTranslation } from 'react-i18next';

interface PrepareBoardProps {}

const PrepareBoard: FC<PrepareBoardProps> = () => {
  const {t} = useTranslation();
  const navigate = useNavigate();
  const { code } = useParams();
  const [board, setBoard] = React.useState<BoardDomain>();
  const [fleet, setFleet] = React.useState<ShipData[]>([]);
  const [waiting, setWaiting] = React.useState(false);
  const token = useAppSelector(selectAuthToken);
  const dispatch = useAppDispatch();

  React.useEffect(() => {
    const getBoard = async () => {
      return await client.get<BoardDomain>(ENDPOINT_GET_BOARD_BY_CODE, {
        params: { code: code },
      });
    };

    getBoard()
      .then((response) => {
        setBoard(response.data);
        setFleet(mapBoxShipsDomainToData(response.data.boxes));
      })
      .catch((err) => {
        console.error(err);
        navigate(PATH_HOME);
      });
  }, [code, navigate]);

  const waitForGame = (code: string) => {
    const eventSource = new EventSourcePolyfill(
      `${process.env.REACT_APP_API_URL}${ENDPOINT_GAME_WAITING}?boardCode=${code}`,
      {
        headers: {
          Authorization: `Bearer ${token!}`,
        },
      }
    );

    setWaiting(true);

    eventSource.onmessage = (e) => console.log(e);
    eventSource.addEventListener('game', async (e: any) => {
      eventSource.close();
      setWaiting(false);
      navigate(passParameters(PATH_GAME, e.data));
    });
    eventSource.onerror = (e) => {
      // error log here
      console.error(e);
      setWaiting(false);
      eventSource.close();
    };
    return () => {
      setWaiting(false);
      eventSource.close();
    };
  };

  const sendData = () => {
    board!.boxes = mapBoxShipsDataToDomain(fleet);
    dispatch(showSpinner());
    client
      .post<BoardDomain>(ENDPOINT_INIT_BOARD, board)
      .then((result) => {
        setBoard(result.data);
        waitForGame(result.data.code);
        dispatch(hideSpinner());
      })
      .catch((err) => {
        console.error(err);
        toast.error(t('prepareBoard.createGameError'), {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'light',
        });
        dispatch(hideSpinner());
      });
  };

  const generateRandomFleet = () => {
    dispatch(showSpinner());
    setTimeout(function () {
      const result = FleetGenerator(board!.width);
      if (result.length > 0) {
        setFleet(result);
      } else {
        toast.error(t('prepareBoard.randomError'), {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'light',
        });
      }
      dispatch(hideSpinner());
    }, 500);
  };

  return (
    <div className={styles.PrepareBoard}>
      <p className='title'>
        {!waiting
          ? t('prepareBoard.title')
          : t('prepareBoard.waiting')}
      </p>
      {board ? (
        <div className='container'>
          <div className='row justify-content-center align-items-center'>
            <div className='col-5'>
              <div className='row'>
                <div className='col-12 text-center mb-5'>{t('prepareBoard.yourFleet')}</div>
              </div>
              <div className={styles.Wrapper}>
                <Ship name={t('ships.carrier')} img={carrier} amount={1} />
                <Ship name={t('ships.battleship')} img={carrier} amount={2} />
                <Ship name={t('ships.submarine')} img={carrier} amount={3} />
                <Ship name={t('ships.destroyer')} img={carrier} amount={4} />
              </div>
            </div>
            <div className='col-1'></div>
            <div className='col-6'>
              <Board
                isOpponent={false}
                size={board.width}
                fleet={{
                  ships: fleet,
                  emptyBoxes: []
                }}
              />
              <div className=' ms-4 my-3'>
                <button
                  className={`${
                    !waiting
                      ? styles.RandomButton
                      : styles.DisableRandomButton
                  } w-100 rounded ms-1`}
                  onClick={generateRandomFleet}
                  disabled={waiting}
                >
                  {t('prepareBoard.randomBtn')}
                </button>
              </div>
            </div>
          </div>
          <div className='row'>
            <button disabled={waiting || fleet.length !== 10} onClick={sendData}>
              {t('prepareBoard.btn')}
            </button>
          </div>
        </div>
      ) : (
        <div>{t('prepareBoard.loading')}</div>
      )}
    </div>
  );
};

export default PrepareBoard;
