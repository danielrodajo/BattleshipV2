import React, { FC } from 'react';
import styles from './Game.module.css';
import GameSection from '../../../components/GameSection/GameSection';
import { useNavigate, useParams } from 'react-router-dom';
import { GameDomain, GameState } from '../../../api/domain/GameDomain';
import client from '../../../api/client';
import { ENDPOINT_GET_CURRENT_GAME } from '../../../utils/Endpoints';
import { ShipData } from '../../../api/data/ShipData';
import { mapBoxShipsDomainToData } from '../../../api/mappers/BoxShipMapper';
import { PATH_HOME } from '../../../utils/Routes';
import { useAppSelector } from '../../../hooks/reduxHooks';
import { selectAuthToken } from '../../../store/slices/AuthSlice';
import { BoxDomain } from '../../../api/domain/BoxDomain';
import { EmptyBoxDomain } from '../../../api/domain/EmptyBoxDomain';
import { toast } from 'react-toastify';
import { Rings } from 'react-loader-spinner';
import useGameWebSocket from '../../../hooks/useGameWebSocket';

interface GameProps {}

interface Finished {
  first: BoxDomain;
  second: boolean;
}

export interface FleetData {
  ships: ShipData[];
  emptyBoxes: EmptyBoxDomain[];
}

const Game: FC<GameProps> = () => {
  const webSocket = useGameWebSocket();
  const [game, setGame] = React.useState<GameDomain>();
  const [myFleet, setMyFleet] = React.useState<FleetData>();
  const [opponentFleet, setOpponentFleet] = React.useState<FleetData>();
  const { code } = useParams();
  const token = useAppSelector(selectAuthToken);
  const [isMyTurn, setMyTurn] = React.useState<boolean | null>(false);
  const [finishedStatus, setFinishedStatus] = React.useState<any>(null);
  const [opponentAlive, setOpponentAlive] = React.useState<boolean[] | null>(
    null
  );
  const navigate = useNavigate();

  const determineTurn = (game: GameDomain): boolean => {
    if (game) {
      setMyTurn(game.turn === game.board1.id);
    }
    return false;
  };

  const topics = [
    '/user/queue/hitted',
    '/user/queue/turn',
    '/user/queue/turn-missed',
    '/user/queue/missed',
    '/user/queue/error',
    '/user/queue/finish',
    '/user/queue/opponent-alive',
  ];

  const gameFinished = (localGame: GameDomain | null): boolean => {
    if (localGame) {
      const stateResponse: number = +GameState[localGame.state];
      return stateResponse === GameState.FINALIZED;
    }
    return false;
  };
/* 
  const handlePing = React.useCallback(
    debounce((stompClient) => {
      // Envía el ping al servidor
      stompClient.send('/ping');

      // Maneja la respuesta
      stompClient.subscribe('/pong', (response) => {
        const { body } = response;
        const result = JSON.parse(body);

        if (result.status === 'fail') {
          // Actualiza el estado o la variable de conteo de pings fallidos
          // Si se han recibido 3 pings fallidos, llama a la función que actualiza el estado del componente
        }
      });
    }, 1000), // Espera 1 segundo antes de ejecutar la función debounce
    []
  ); */

  React.useEffect(() => {
    let intervalId: NodeJS.Timer;
    if (webSocket.connected) {
      setTimeout(() => {
        /* intervalId = setInterval(() => {
          webSocket.sendMessage('/app/api/v1/ws/game/opponent-alive');
        }, 3000); */
      }, 4000);
    }
    return () => {
      if (webSocket.connected) {
        webSocket.disconnect();
        clearInterval(intervalId);
      }
    };
  }, [webSocket.connected]);

  React.useEffect(() => {
    if (webSocket.currentMessage) {
      switch (webSocket.currentMessage[0]) {
        case '/user/queue/hitted':
          {
            setMyTurn(false);
            const box: BoxDomain = JSON.parse(webSocket.currentMessage[1]);
            const ship: ShipData = mapBoxShipsDomainToData([box])[0];
            const shipAux = opponentFleet?.ships.find((s) => s.id === ship.id);
            if (shipAux) {
              shipAux.boxes = shipAux.boxes.concat(ship.boxes);
              setOpponentFleet(opponentFleet);
            } else {
              opponentFleet?.ships.push(ship);
              setOpponentFleet(opponentFleet);
            }
          }
          break;
        case '/user/queue/turn':
          {
            setMyTurn(true);
            const box: BoxDomain = JSON.parse(webSocket.currentMessage[1]);
            const ship: ShipData = mapBoxShipsDomainToData([box])[0];
            const shipAux = myFleet?.ships.find((s) => s.id === ship.id);
            if (shipAux) {
              const box = shipAux.boxes.find((b) => b.id === ship.boxes[0].id);
              if (box) {
                box.touched = true;
                setMyFleet(myFleet);
              }
            }
          }
          break;
        case '/user/queue/turn-missed':
          {
            setMyTurn(true);
            const emptyBox: EmptyBoxDomain = JSON.parse(
              webSocket.currentMessage[1]
            );
            myFleet?.emptyBoxes.push(emptyBox);
            setMyFleet(myFleet);
          }
          break;
        case '/user/queue/missed':
          {
            setMyTurn(false);
            const emptyBox: EmptyBoxDomain = JSON.parse(
              webSocket.currentMessage[1]
            );
            opponentFleet?.emptyBoxes.push(emptyBox);
            setOpponentFleet(opponentFleet);
          }
          break;
        case '/user/queue/finish':
          {
            const finished: Finished = JSON.parse(webSocket.currentMessage[1]);
            setMyTurn(null);
            if (webSocket.connected) {
              webSocket.disconnect();
            }
            client
              .get<GameDomain>(ENDPOINT_GET_CURRENT_GAME, {
                params: { code: code },
              })
              .then((response) => {
                setGame(response.data);
                setFinishedStatus(finished.second ? 'Victoria' : 'Derrota');
                setMyFleet({
                  ships: mapBoxShipsDomainToData(response.data.board1.boxes),
                  emptyBoxes: response.data.board1.emptyBoxes,
                });
                setOpponentFleet({
                  ships: mapBoxShipsDomainToData(response.data.board2.boxes),
                  emptyBoxes: response.data.board2.emptyBoxes,
                });
              })
              .catch((err) => {
                console.error(err);
                toast.error('Error inesperado', {
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
          }
          break;
        case '/user/queue/opponent-alive':
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
        case '/user/queue/error':
          {
            console.log('ERROR');
            console.log(webSocket.currentMessage[1]);
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
          }
          break;
      }
    }
  }, [webSocket.currentMessage]);

  React.useEffect(() => {
    client
      .get<GameDomain>(ENDPOINT_GET_CURRENT_GAME, {
        params: { code: code },
      })
      .then((response) => {
        setGame(response.data);
        if (gameFinished(response.data)) {
          setMyTurn(null);
        } else {
          determineTurn(response.data);
          webSocket.connect(
            `${process.env.REACT_APP_API_URL}/ws/game/room/`,
            topics,
            { 'x-auth-token': token, 'game-code': response.data.code }
          );
        }
        setMyFleet({
          ships: mapBoxShipsDomainToData(response.data.board1.boxes),
          emptyBoxes: response.data.board1.emptyBoxes,
        });
        setOpponentFleet({
          ships: mapBoxShipsDomainToData(response.data.board2.boxes),
          emptyBoxes: response.data.board2.emptyBoxes,
        });
      })
      .catch((err) => {
        console.error(err);
        navigate(PATH_HOME);
      });
  }, []);

  function sendMessage(x: number, y: number) {
    webSocket.sendMessage('/app/api/v1/ws/game/room', { x, y });
  }

  return game && myFleet && opponentFleet ? (
    <div className={styles.Game}>
      {finishedStatus && (
        <div
          className={styles.FinishedContainer}
          onClick={() => setFinishedStatus(null)}
        >
          {[...finishedStatus].map((l, i) => (
            <span
              key={`${l}-${i}`}
              className={`${styles.FinishedText} ${
                finishedStatus === 'Victoria' ? styles.text1 : styles.text2
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
          {isMyTurn === null ? 'Partida finalizada' : 'Partida'}
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
          {isMyTurn !== null && (isMyTurn ? 'Tu turno' : 'Turno del oponente')}
        </div>
      </div>
      <div className={styles.Board}>
        <div className='container'>
          <div className='row'>
            <div className='col-6 border-end pe-5'>
              <GameSection
                fleet={myFleet}
                playerName={game.board1.owner.name}
                isOpponent={false}
                size={game.board1.width}
                disable={!isMyTurn || false}
              />
            </div>
            <div className='col-6 ps-5'>
              <GameSection
                online={opponentAlive}
                onClick={sendMessage}
                fleet={opponentFleet}
                playerName={game.board2.owner.name}
                isOpponent={true}
                disable={isMyTurn || false}
                size={game.board2.width}
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
