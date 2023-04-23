import React, { FC } from 'react';
import styles from './Score.module.css';
import { RankingResponse } from '../../api/domain/requests/RankingResponse';

interface ScoreProps {
  ranking: RankingResponse[];
}

const Score: FC<ScoreProps> = ({ ranking }) => {
  return (
    <>
      <table className={`${styles.Score} table table-striped`}>
        <thead>
          <tr>
            <th scope='col'>Posición</th>
            <th scope='col'>Jugador</th>
            <th scope='col'>Nº Partidas</th>
            <th scope='col'>Puntos</th>
          </tr>
        </thead>
        <tbody className=''>
          {ranking.sort((a, b) => b.points - a.points).map((r, i) => (
              <tr key={`${r.nickname}-${i}`}>
                <th>{i + 1}</th>
                <td>{r.nickname}</td>
                <td>{r.games}</td>
                <td>{r.points}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </>
  );
};

export default Score;
