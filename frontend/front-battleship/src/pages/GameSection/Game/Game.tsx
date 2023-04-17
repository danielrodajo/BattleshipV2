import React, { FC } from 'react';
import styles from './Game.module.css';
import GameSection from '../../../components/GameSection/GameSection';
import { useNavigate, useParams } from 'react-router-dom';
import { GameDomain, GameState } from '../../../api/domain/GameDomain';
import { ShipData } from '../../../api/data/ShipData';
import { useAppDispatch, useAppSelector } from '../../../hooks/reduxHooks';
import { selectAuthToken } from '../../../store/slices/AuthSlice';
import { BoxDomain } from '../../../api/domain/BoxDomain';
import { EmptyBoxDomain } from '../../../api/domain/EmptyBoxDomain';
import { toast } from 'react-toastify';
import { Rings } from 'react-loader-spinner';
import useGameWebSocket from '../../../hooks/useGameWebSocket';
import History from '../../../components/Record/Record';
import { RecordData } from '../../../api/data/RecordData';
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
  addGameRecord,
  fetchGameData,
  fetchGameRecordsData,
  hitMissed,
  hitMyBox,
  hitOpponentMissed,
  hitOpponentBox,
  selectGame,
  selectGameFinishedStatus,
  selectGameIsMyTurn,
  selectGameMyFleet,
  selectGameOpponentFleet,
  selectGameRecords,
  updateFinishedStatus,
  updateIsMyTurn,
  selectGameLoading,
  selectGameError,
} from '../../../store/slices/GameSlice';
import { BoardState } from '../../../api/domain/BoardDomain';
import { useTranslation } from 'react-i18next';
import { hideSpinner, showSpinner } from '../../../store/slices/SpinnerSlice';
import { formatError } from '../../../utils/Utils';
import { PATH_HOME } from '../../../utils/Routes';
import { Coordinates } from '../../../services/FleetGenerator';

interface GameProps {}

export interface FleetData {
  ships: ShipData[];
  emptyBoxes: EmptyBoxDomain[];
}

const Game: FC<GameProps> = () => {
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
  const isMyTurn = useAppSelector(selectGameIsMyTurn);
  const finishedStatus = useAppSelector(selectGameFinishedStatus);
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

  const createHistory = (
    box: BoxDomain | null,
    empty: EmptyBoxDomain | null,
    isOpponent: boolean
  ) => {
    let x = 0;
    let y = 0;
    let type = '';
    if (box) {
      x = box.x;
      y = box.y;
      type = 'BOX';
    } else if (empty) {
      x = empty.x;
      y = empty.y;
      type = 'EMPTY';
    } else {
      return;
    }
    const newRecord: RecordData = {
      x: letters[x],
      y: y + 1,
      createdAt: new Date(),
      player: isOpponent ? game!.board2.owner : game!.board1.owner,
      type,
    };
    dispatch(addGameRecord(newRecord));
  };

  const setHistory = (xData: string, yData: number, owner?: string) => {
    const x = letters.indexOf(xData);
    const y = yData - 1;
    if (owner) {
      sethighLightCoordinates({
        x,
        y,
        owner,
      });
    }
  };

  React.useEffect(() => {
    if (code) {
      dispatch(
        fetchGameData({
          data: code,
          showFinished: false,
        })
      ).then(() =>
        dispatch(fetchGameRecordsData(code)).then(() =>
          webSocket.connect(
            `${process.env.REACT_APP_API_URL}/ws/game/room/`,
            topics,
            { 'x-auth-token': token, 'game-code': code }
          )
        )
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
      switch (webSocket.currentMessage[0]) {
        case WS_HITTED:
          {
            dispatch(updateIsMyTurn(false));
            const box: BoxDomain = JSON.parse(webSocket.currentMessage[1]);
            dispatch(hitOpponentBox(box));
            createHistory(box, null, false);
          }
          break;
        case WS_TURN:
          {
            dispatch(updateIsMyTurn(true));
            const box: BoxDomain = JSON.parse(webSocket.currentMessage[1]);
            dispatch(hitMyBox(box));
            createHistory(box, null, true);
          }
          break;
        case WS_TURN_MISSED:
          {
            dispatch(updateIsMyTurn(true));
            const emptyBox: EmptyBoxDomain = JSON.parse(
              webSocket.currentMessage[1]
            );
            dispatch(hitMissed(emptyBox));
            createHistory(null, emptyBox, true);
          }
          break;
        case WS_MISSED:
          {
            dispatch(updateIsMyTurn(false));
            const emptyBox: EmptyBoxDomain = JSON.parse(
              webSocket.currentMessage[1]
            );
            dispatch(hitOpponentMissed(emptyBox));
            createHistory(null, emptyBox, false);
          }
          break;
        case WS_FINISH:
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
            ).then(() => dispatch(fetchGameRecordsData(code)));
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
          console.log(webSocket.currentMessage);
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

  function sendMessage(x: number, y: number) {
    webSocket.sendMessage('/app/api/v1/ws/game/room', { x, y });
  }

  const getHighlight = (owner: string): Coordinates | undefined => {
    console.log(highLightCoordinates?.owner);
    console.log(owner);
    if (highLightCoordinates?.owner && highLightCoordinates?.owner === owner)
      return highLightCoordinates;
  };

  return game && myFleet && opponentFleet ? (
    <div className={styles.Game}>
      {finishedStatus && (
        <div
          className={styles.FinishedContainer}
          onClick={() => dispatch(updateFinishedStatus(null))}
        >
          {[
            ...(finishedStatus === BoardState[BoardState.WIN]
              ? t('game.win')
              : t('game.lose')),
          ].map((l, i) => (
            <span
              key={`${l}-${i}`}
              className={`${styles.FinishedText} ${
                finishedStatus === BoardState[BoardState.WIN]
                  ? styles.text1
                  : styles.text2
              }`}
            >
              {l}
            </span>
          ))}
        </div>
      )}

      <div className='row title user-select-none mx-3 mb-3'>
        <div className='col-4'></div>
        <div className='col-4'>
          {isMyTurn === null ? t('game.end-game') : t('game.title')}
        </div>
        <div className={`col-4 text-end ${styles.TurnText}`}>
          {(webSocket.sending ||
            (!webSocket.connected && !gameFinished(game))) && (
            <Rings
              height='45'
              width='45'
              color={
                !webSocket.connected && !finishedStatus ? '#dc3545' : '#4fa94d'
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
      <div className={styles.Board}>
        <div className='px-5'>
          <div className='row'>
            <div className='col-5 border-end pe-5'>
              <GameSection
                fleet={myFleet}
                playerName={game.board1.owner.name}
                isOpponent={false}
                size={game.board1.width}
                disable={!isMyTurn || false}
                highLightBox={getHighlight(game.board1.owner.name)}
              />
            </div>
            <div className='col-5 ps-5'>
              <GameSection
                online={opponentAlive}
                onClick={sendMessage}
                fleet={opponentFleet}
                playerName={game.board2.owner.name}
                isOpponent={true}
                disable={isMyTurn || false}
                size={game.board2.width}
                highLightBox={getHighlight(game.board2.owner.name)}
              />
            </div>
            <div className='col-2 ps-5'>
              <History
                setHistory={setHistory}
                records={records}
                modified={false}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div>Cargando</div>
  );
};

export default Game;
