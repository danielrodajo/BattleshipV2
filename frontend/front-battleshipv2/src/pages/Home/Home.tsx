import { FC } from 'react';
import client from '../../api/client';
import { ENDPOINT_GET_ALL_GAMES } from '../../utils/Endpoints';

interface HomeProps {}

const Home: FC<HomeProps> = () => {
  const getAllGames = () => {
    client.get(ENDPOINT_GET_ALL_GAMES);
  };



  return (
    <div>
      HOME PAGE
      <button onClick={getAllGames}>Get Games</button>
    </div>
  );
};
export default Home;
