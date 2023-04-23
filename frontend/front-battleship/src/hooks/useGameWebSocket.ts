import SockJS from 'sockjs-client';
import React from 'react';
import { CompatClient, Stomp } from '@stomp/stompjs';
import { toast } from 'react-toastify';

const useGameWebSocket = () => {
  const [stompClient, setStompClient] = React.useState<CompatClient>();
  const [connected, setConnected] = React.useState(false);
  const [sending, setSending] = React.useState(false);
  const [currentMessage, setCurrentMessage] = React.useState<[string, string]>();

  function connect(url: string, topics: string[], connectData?: any) {
    const socket: WebSocket = new SockJS(url);
    const client = Stomp.over(() => socket);
    setStompClient(client);
    client.connect(
      connectData,
      function () {
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
    client.debug = () => {};
  }
 
  function sendMessage(url: string, payload?: any) {
    stompClient!.send(url, {}, payload && JSON.stringify(payload));
    setSending(true);
  }

  function disconnect() {
    if (stompClient) {
      stompClient.disconnect();
      stompClient.deactivate();
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
