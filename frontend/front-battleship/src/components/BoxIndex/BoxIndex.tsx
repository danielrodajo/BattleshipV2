import React, { FC } from 'react';
import styles from './BoxIndex.module.css';
export enum BoxType {
  HORIZONTAL,
  VERTICAL,
  EMPTY,
}

interface BoxIndexProps {
  size: number;
  value?: string;
  boxType: BoxType;
}

const BoxIndex: FC<BoxIndexProps> = (props) => {

  
  return (
    <div className={styles.BoxIndex}>
      {props.value && <span>{props.value}</span>}
    </div>
  );
};

export default BoxIndex;
