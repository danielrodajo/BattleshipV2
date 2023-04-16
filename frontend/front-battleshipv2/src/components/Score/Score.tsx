import React, { FC } from 'react';
import styles from './Score.module.css';

interface ScoreProps {}

const Score: FC<ScoreProps> = () => (
  <>
    <table className={`${styles.Score} table table-striped`}>
      <thead>
        <tr>
          <th scope="col">Posición</th>
          <th scope="col">Jugador</th>
          <th scope="col">Nº Partidas</th>
          <th scope="col">Puntos</th>
        </tr>
      </thead>
      <tbody className="">
        <tr>
          <th scope="row">1</th>
          <td>Daniel</td>
          <td>5</td>
          <td>1000</td>
        </tr>
        <tr>
          <th scope="row">1</th>
          <td>Daniel</td>
          <td>5</td>
          <td>1000</td>
        </tr>
        <tr>
          <th scope="row">1</th>
          <td>Daniel</td>
          <td>5</td>
          <td>1000</td>
        </tr>
      </tbody>
    </table>
  </>
);

export default Score;
