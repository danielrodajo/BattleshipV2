import { FC, useState } from 'react';
import styles from './Box.module.css';
import React from 'react';
import { BoxData } from '../../api/data/BoxData';
import { ShipType } from '../../api/domain/ShipDomain';
import { EmptyBoxDomain } from '../../api/domain/EmptyBoxDomain';

interface BoxProps {
  isOpponent: boolean;
  boxData?: [BoxData, ShipType];
  emptyBoxData?: EmptyBoxDomain;
  disable?: boolean;
  onClick?: (x: number, y: number) => void;
  x: number;
  y: number;
}

const Box: FC<BoxProps> = (props) => {
  const [clicked, setClicked] = useState(false);
  const [animated, setAnimated] = useState(false);

  React.useEffect(() => {
    if (props.boxData) {
      setClicked(props.boxData[0].touched);
    } else if (props.emptyBoxData) {
      setClicked(true);
    } else setClicked(false);
  }, [props]);

  const handlerClicker = () => {
    if (!clicked && props.isOpponent && props.disable) {
      /* console.log(props.boxData);
      if (props.boxData) {
        console.log('animacion');
        props.boxData[0].touched = true;
        setAnimated(true);
      } */
      setAnimated(true);
      props.onClick!(props.x, props.y);
      setClicked(true);
    }
  };

  const getStyle = (): string => {
    if (props.boxData) {
      switch (props.boxData[1]) {
        case ShipType.CARRIER:
          return styles.BoxShipCr;
        case ShipType.BATTLESHIP:
          return styles.BoxShipBs;
        case ShipType.SUBMARINE:
          return styles.BoxShipSm;
        case ShipType.DESTROYER:
          return styles.BoxShipDt;
        default:
          return '';
      }
    }
    return '';
  };

  return (
    <div
      onClick={handlerClicker}
      className={`${animated && styles.boxAnimation} ${
        props.boxData && (clicked ? styles.BoxShipHitted : getStyle())
      } ${clicked && (props.isOpponent ? styles.opponentClicked : styles.clicked)} ${
        styles.Box
      } ${
        props.isOpponent
          ? props.disable
            ? styles.opponent
            : styles.opponentDisabled
          : styles.user
      }`}
    ></div>
  );
};

export default Box;
