import SockJS from 'sockjs-client';
import { selectAuthToken } from '../store/slices/AuthSlice';
import { useAppSelector } from './reduxHooks';
import React from 'react';
import { CompatClient, Stomp } from '@stomp/stompjs';
import { ShipData } from '../api/data/ShipData';
import { EmptyBoxDomain } from '../api/domain/EmptyBoxDomain';
import { mapBoxShipsDomainToData } from '../api/mappers/BoxShipMapper';
import { GameDomain } from '../api/domain/GameDomain';
import { BoxDomain } from '../api/domain/BoxDomain';
import { toast } from 'react-toastify';

interface Finished {
  first: BoxDomain;
  second: boolean;
}

const useGameWebSocket = () => {
  const [stompClient, setStompClient] = React.useState<CompatClient>();
  const [connected, setConnected] = React.useState(false);
  const [sending, setSending] = React.useState(false);
  const token = useAppSelector(selectAuthToken);
  const [currentMessage, setCurrentMessage] = React.useState<[string, string]>();

  function connect(url: string, topics: string[], connectData?: any) {
    const socket: WebSocket = new SockJS(url);
    const client = Stomp.over(() => socket);
    setStompClient(client);
    client.connect(
      connectData,
      function (frame: any) {
        let sessionURL = client.ws._transport.url;
        sessionURL = sessionURL.replace(url, '');
        sessionURL = sessionURL.replace('/websocket', '');
        sessionURL = sessionURL.replace(/^[0-9]+\//, '');
        setConnected(true);

        topics.forEach((topic) => {
          client.subscribe(`${topic}-user${sessionURL}`, (msgOut) => {
            setSending(false);
            setCurrentMessage([topic, msgOut.body]);
          });
        });
      },
      function (err: any) {
        toast.error('Error al conectar con el servidor', {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'light',
        });
        console.error(err);
      }
    );
  }
 
  function sendMessage(url: string, payload?: any) {
    stompClient!.send(url, {}, payload && JSON.stringify(payload));
    setSending(true);
  }

  function disconnect() {
    if (stompClient) {
      stompClient.disconnect();
      stompClient.deactivate();
      console.log('Disconnected');
    }
    setConnected(false);
  }

  return {
    connect,
    sendMessage,
    disconnect,
    stompClient,
    connected,
    sending,
    currentMessage,
  };
};
export default useGameWebSocket;
