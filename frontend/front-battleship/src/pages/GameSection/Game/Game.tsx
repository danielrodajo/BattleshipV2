import React, { FC } from 'react';
import styles from './Game.module.css';
import GameSection from '../../../components/GameSection/GameSection';
import { useNavigate, useParams } from 'react-router-dom';
import { GameDomain, GameState } from '../../../api/domain/GameDomain';
import { ShipData } from '../../../api/data/ShipData';
import { useAppDispatch, useAppSelector } from '../../../hooks/reduxHooks';
import {
  addUserPoints,
  refreshToken,
  selectAuthRefreshToken,
  selectAuthToken,
} from '../../../store/slices/AuthSlice';
import { EmptyBoxDomain } from '../../../api/domain/EmptyBoxDomain';
import { toast } from 'react-toastify';
import { Rings } from 'react-loader-spinner';
import useGameWebSocket from '../../../hooks/useGameWebSocket';
import History from '../../../components/Record/Record';
import {
  WS_ERROR,
  WS_FINISH,
  WS_HITTED,
  WS_MISSED,
  WS_OP_ALIVE,
  WS_TURN,
  WS_TURN_MISSED,
  letters,
} from '../../../utils/Constants';
import {
  fetchGameData,
  fetchGameRecordsData,
  selectGame,
  selectGameFinishedStatus,
  selectGameIsMyTurn,
  selectGameMyFleet,
  selectGameOpponentFleet,
  selectGameRecords,
  updateIsMyTurn,
  selectGameLoading,
  selectGameError,
} from '../../../store/slices/GameSlice';
import { useTranslation } from 'react-i18next';
import { hideSpinner, showSpinner } from '../../../store/slices/SpinnerSlice';
import { formatError, parseJwt } from '../../../utils/Utils';
import { PATH_HOME } from '../../../Routes';
import FinishGameMessage from '../../../components/FinishGameMessage/FinishGameMessage';
import useWebSocketResponse from '../../../hooks/useWebSocketResponse';
import { fetchRefreshToken } from '../../../api/requests/authAPI';
import { Coordinates } from '../../../hooks/useFleetHandler';

interface GameProps {}

export interface FleetData {
  ships: ShipData[];
  emptyBoxes: EmptyBoxDomain[];
}

const Game: FC<GameProps> = () => {
  const [points, setPoints] = React.useState<number | null>(null);
  const finishedStatus = useAppSelector(selectGameFinishedStatus);
  const { manageResponse } = useWebSocketResponse();
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const loading = useAppSelector(selectGameLoading);
  const error = useAppSelector(selectGameError);
  const webSocket = useGameWebSocket();
  const game = useAppSelector(selectGame);
  const myFleet = useAppSelector(selectGameMyFleet);
  const opponentFleet = useAppSelector(selectGameOpponentFleet);
  const { code } = useParams();
  const token = useAppSelector(selectAuthToken);
  const rToken = useAppSelector(selectAuthRefreshToken);
  const isMyTurn = useAppSelector(selectGameIsMyTurn);
  const [highLightCoordinates, sethighLightCoordinates] =
    React.useState<Coordinates | null>(null);
  const [opponentAlive, setOpponentAlive] = React.useState<boolean[] | null>(
    null
  );
  const records = useAppSelector(selectGameRecords);
  const navigate = useNavigate();
  const topics = [
    WS_HITTED,
    WS_MISSED,
    WS_TURN,
    WS_TURN_MISSED,
    WS_ERROR,
    WS_FINISH,
    WS_OP_ALIVE,
  ];

  const gameFinished = (localGame: GameDomain | null): boolean => {
    if (localGame) {
      const stateResponse: number = +GameState[localGame.state];
      return stateResponse === GameState.FINALIZED;
    }
    return false;
  };

  React.useEffect(() => {
    if (code) {
      dispatch(
        fetchGameData({
          data: code,
          showFinished: false,
        })
      ).then(() =>
        dispatch(fetchGameRecordsData(code)).then(async () => {
          const decodedJwt = parseJwt(token!);
          let auxToken = token;
          if (decodedJwt.exp * 1000 < Date.now()) {
            const response = await fetchRefreshToken(rToken!);
            auxToken = response?.token;
            dispatch(refreshToken(response));
          }
          webSocket.connect(
            `${process.env.REACT_APP_API_URL}/ws/game/room/`,
            topics,
            { 'x-auth-token': auxToken, 'game-code': code }
          );
        })
      );
    }
  }, []);

  React.useEffect(() => {
    return () => {
      if (webSocket.connected) {
        webSocket.disconnect();
      }
    };
  }, [webSocket.connected]);

  React.useEffect(() => {
    if (webSocket.currentMessage) {
      const unmanageResponse = manageResponse(webSocket.currentMessage, game!);
      if (unmanageResponse) {
        switch (unmanageResponse) {
          case WS_FINISH:
            const points = webSocket.currentMessage[1];
            setPoints(+points);
            dispatch(updateIsMyTurn(false));
            if (webSocket.connected) {
              webSocket.disconnect();
            }
            if (code) {
              dispatch(
                fetchGameData({
                  data: code,
                  showFinished: true,
                })
              ).then(async () => {
                dispatch(fetchGameRecordsData(code));
              });
            }
            break;
          case WS_OP_ALIVE:
            {
              const response = webSocket.currentMessage[1] === 'true';
              if (response) {
                setOpponentAlive([]);
              } else {
                let opponentPings: boolean[] = [];
                if (opponentAlive) {
                  opponentPings = [...opponentAlive];
                }
                opponentPings.push(response);
                setOpponentAlive(opponentPings);
              }
            }
            break;
          case WS_ERROR:
            toast.error(webSocket.currentMessage[1], {
              position: 'top-right',
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: 'light',
            });
            break;
        }
      }
    }
  }, [webSocket.currentMessage]);

  React.useEffect(() => {
    if (loading) {
      dispatch(showSpinner());
    } else {
      dispatch(hideSpinner());
    }
  }, [loading]);

  React.useEffect(() => {
    if (error) {
      if (error.origin === 'fetchGameData') {
        navigate(PATH_HOME);
      } else {
        console.error(error.data);
        toast.error(formatError(error.origin), {
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
    }
  }, [error]);

  React.useEffect(() => {
    if (points !== null) {
      const add = points >= 0;
      const onesArray = Array.from({ length: add ? points : points * -1 }, () =>
        add ? 1 : -1
      );
      const animationDuration = 1000;
      setTimeout(() => {
        onesArray.forEach((n, i) => {
          const delay = i * (animationDuration / onesArray.length);
          setTimeout(() => {
            setPoints(points - n * (i + 1));
            dispatch(addUserPoints(n));
          }, delay);
        });
      }, 2000);
    }
  }, [finishedStatus]);

  function sendMessage(x: number, y: number) {
    webSocket.sendMessage('/app/api/v1/ws/game/room', { x, y });
  }

  const setHistory = (xData: string, yData: number, owner?: string) => {
    const x = letters.indexOf(xData);
    const y = yData - 1;
    if (owner) {
      if (
        highLightCoordinates &&
        highLightCoordinates.x === x &&
        highLightCoordinates.y === y &&
        highLightCoordinates.owner === owner
      ) {
        sethighLightCoordinates(null);
      } else {
        sethighLightCoordinates({
          x,
          y,
          owner,
        });
      }
    }
  };

  const getHighlight = (owner: string): Coordinates | undefined => {
    if (highLightCoordinates?.owner && highLightCoordinates?.owner === owner)
      return highLightCoordinates;
  };

  return (
    game &&
    myFleet &&
    opponentFleet && (
      <div className={styles.Game}>
        <FinishGameMessage finishedStatus={finishedStatus} points={points} />
        <div className='row title user-select-none mx-3 mb-3'>
          <div className='col-md-4'></div>
          <div className='col-md-4'>
            {isMyTurn === null ? t('game.end-game') : t('game.title')}
          </div>
          <div className={`col-md-4 text-end ${styles.TurnText}`}>
            {(webSocket.sending ||
              (!webSocket.connected && !gameFinished(game))) && (
              <Rings
                height='45'
                width='45'
                color={
                  !webSocket.connected && !finishedStatus
                    ? '#dc3545'
                    : '#4fa94d'
                }
                radius='6'
                wrapperStyle={{}}
                wrapperClass='me-3'
                visible={true}
                ariaLabel='rings-loading'
              />
            )}
            {isMyTurn !== null &&
              (isMyTurn ? t('game.your-turn') : t('game.opponent-turn'))}
          </div>
        </div>
        <div>
          <div className='px-5'>
            <div className='row'>
              <div className={`col-lg-6 col-xl-5 ${styles.MyFleetBoard}`}>
                <GameSection
                  fleet={myFleet}
                  playerName={game.board1.owner.nickname}
                  isOpponent={false}
                  size={game.board1.width}
                  disable={!isMyTurn || false}
                  highLightBox={getHighlight(game.board1.owner.nickname)}
                />
                <div className='d-block d-xl-none mb-5'></div>
              </div>
              <div className={`col-lg-6 col-xl-5 ${styles.EnemyFleetBoard}`}>
                <GameSection
                  online={opponentAlive}
                  onClick={sendMessage}
                  fleet={opponentFleet}
                  playerName={game.board2.owner.nickname}
                  isOpponent={true}
                  disable={isMyTurn || false}
                  size={game.board2.width}
                  highLightBox={getHighlight(game.board2.owner.nickname)}
                />
                <div className='d-block d-xl-none mb-5'></div>
              </div>
              <div className='col-xl-2 ps-5'>
                <History
                  setHistory={setHistory}
                  records={records}
                  modified={false}
                  focus={highLightCoordinates}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default Game;
