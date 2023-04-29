import React, { FC } from 'react';
import styles from './PrepareGame.module.css';
import { useNavigate, useParams } from 'react-router-dom';
import client from '../../api/client';
import {
  ENDPOINT_GAME_WAITING,
  ENDPOINT_GET_BOARD_BY_CODE,
  ENDPOINT_INIT_BOARD,
} from '../../utils/Endpoints';
import { BoardDomain, BoardState } from '../../api/domain/BoardDomain';
import { PATH_GAME, PATH_HOME, passParameters } from '../../Routes';
import carrier from '../../assets/carrier.png';
import Ship from '../../components/Ship/Ship';
import FleetGenerator from '../../services/FleetGenerator';
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks';
import { hideSpinner, showSpinner } from '../../store/slices/SpinnerSlice';
import { toast } from 'react-toastify';
import {
  mapBoxShipsDataToDomain,
  mapBoxShipsDomainToData,
} from '../../api/mappers/BoxShipMapper';
import { EventSourcePolyfill } from 'event-source-polyfill';
import {
  refreshToken,
  selectAuthRefreshToken,
  selectAuthToken,
} from '../../store/slices/AuthSlice';
import { useTranslation } from 'react-i18next';
import { parseJwt } from '../../utils/Utils';
import { fetchRefreshToken } from '../../api/requests/authAPI';
import PrepareBoard from '../../components/PrepareBoard/PrepareBoard';
import { ShipType } from '../../api/domain/ShipDomain';
import {
  replaceFleet,
  selectPrepareGameFleet,
  moveDirection,
} from '../../store/slices/PrepareGameSlice';
import { GrRotateLeft, GrRotateRight } from 'react-icons/gr';

interface PrepareBoardProps {}

const PrepareGame: FC<PrepareBoardProps> = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { code } = useParams();
  const [board, setBoard] = React.useState<BoardDomain>();
  const [waiting, setWaiting] = React.useState(false);
  const token = useAppSelector(selectAuthToken);
  const rToken = useAppSelector(selectAuthRefreshToken);
  const fleet = useAppSelector(selectPrepareGameFleet);
  const [sse, setSse] = React.useState<any>();
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
        dispatch(replaceFleet(mapBoxShipsDomainToData(response.data.boxes)));
        if (response.data.state === BoardState[BoardState.IN_PROGRESS]) {
          waitForGame(response.data.code);
        }
      })
      .catch((err) => {
        console.error(err);
        navigate(PATH_HOME);
      });
  }, [code, navigate]);

  React.useEffect(() => {
    return () => {
      disconnect();
    };
  }, [sse]);

  const disconnect = () => {
    if (sse) {
      setWaiting(false);
      sse.close();
      setSse(null);
    }
  };

  const waitForGame = async (code: string) => {
    const decodedJwt = parseJwt(token!);
    let auxToken = token;
    if (decodedJwt.exp * 1000 < Date.now()) {
      const response = await fetchRefreshToken(rToken!);
      auxToken = response?.token;
      dispatch(refreshToken(response));
    }
    const eventSource = new EventSourcePolyfill(
      `${process.env.REACT_APP_API_URL}${ENDPOINT_GAME_WAITING}?boardCode=${code}`,
      {
        headers: {
          Authorization: `Bearer ${auxToken}`,
        },
      }
    );

    setWaiting(true);
    setSse(eventSource);

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
        dispatch(replaceFleet(result));
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
    <div className={styles.PrepareGame}>
      <p className='title'>
        {!waiting ? t('prepareBoard.title') : t('prepareBoard.waiting')}
      </p>
      {board ? (
        <div className='container'>
          <div className='row justify-content-center align-items-center'>
            <div className='col-5'>
              <div className='row'>
                <div className={`col-12 mb-5 ${styles.FleetTitle}`}>
                  <div className='d-flex justify-content-center align-items-center'>
                    <GrRotateLeft
                      className={`${styles.RotateBtn} ${styles.RotateBtnL}`}
                      onClick={() => dispatch(moveDirection(-100))}
                    />
                  </div>
                  <div className='d-flex justify-content-center align-items-center'>
                    <span className={styles.YourFleetTitle}>
                      {t('prepareBoard.yourFleet')}
                    </span>
                  </div>
                  <div className='d-flex justify-content-center align-items-center'>
                    <GrRotateRight
                      className={`${styles.RotateBtn} ${styles.RotateBtnR}`}
                      onClick={() => dispatch(moveDirection(100))}
                    />
                  </div>
                </div>
              </div>
              <div
                className={styles.Wrapper}
                onWheel={(e) => dispatch(moveDirection(e.deltaY))}
              >
                <Ship
                  size={board!.width}
                  type={ShipType.CARRIER}
                  img={carrier}
                  amount={1}
                />
                <Ship
                  size={board!.width}
                  type={ShipType.BATTLESHIP}
                  img={carrier}
                  amount={2}
                />
                <Ship
                  size={board!.width}
                  type={ShipType.SUBMARINE}
                  img={carrier}
                  amount={3}
                />
                <Ship
                  size={board!.width}
                  type={ShipType.DESTROYER}
                  img={carrier}
                  amount={4}
                />
              </div>
            </div>
            <div className='col-1'></div>
            <div className='col-6'>
              <PrepareBoard
                size={board.width}
                fleet={{
                  ships: fleet,
                  emptyBoxes: [],
                }}
              />
              <div className=' ms-4 my-3'>
                <button
                  className={`${
                    !waiting ? styles.RandomButton : styles.DisableRandomButton
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
            <button
              className={`botonJugar ${
                !(waiting || fleet.length !== 10) && 'botonJugarAnim'
              }`}
              disabled={waiting || fleet.length !== 10}
              onClick={sendData}
            >
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

export default PrepareGame;
