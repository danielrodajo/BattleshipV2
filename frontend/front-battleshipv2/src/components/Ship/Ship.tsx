import React, { FC } from 'react';
import styles from './Ship.module.css';

interface ShipProps {
  name: string;
  img: string;
  amount: number;
}

const Ship: FC<ShipProps> = (props) => (
  <div
    className={`${styles.Ship} d-flex justify-content-center align-items-center`}
  >
    <div>
      <p>{`${props.name} x${props.amount}`}</p>
      <img src={props.img} width={100} alt={`Imagen de ${props.name}`} />
    </div>
  </div>
);

export default Ship;
