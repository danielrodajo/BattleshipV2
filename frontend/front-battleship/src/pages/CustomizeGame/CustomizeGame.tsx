import React, { FC } from 'react';
import styles from './CustomizeGame.module.css';

interface CustomizeGameProps {}

const CustomizeGame: FC<CustomizeGameProps> = () => (
  <div className={styles.CustomizeGame}>
    CustomizeGame Component
  </div>
);

export default CustomizeGame;
