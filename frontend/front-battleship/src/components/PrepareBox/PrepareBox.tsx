import React, { FC } from 'react';
import styles from './PrepareBox.module.css';
import { ShipType } from '../../api/domain/ShipDomain';
import { BoxData } from '../../api/data/BoxData';
import { ShipData } from '../../api/data/ShipData';
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks';
import {
  pushFleet,
  removeShipFromFleet,
  selectPrepareGameDirection,
  selectPrepareGameDraggingShip,
  selectPrepareGameFleet,
  selectPrepareGameMouseOnBoard,
  setDirection,
  setDraggingShip,
  setMouseOnBoard,
} from '../../store/slices/PrepareGameSlice';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

interface PrepareBoxProps {
  boxData?: [BoxData, ShipType];
  x: number;
  y: number;
  size: number;
}

const PrepareBox: FC<PrepareBoxProps> = (props) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const draggingShip = useAppSelector(selectPrepareGameDraggingShip);
  const direction = useAppSelector(selectPrepareGameDirection);
  const fleet = useAppSelector(selectPrepareGameFleet);
  const mouseOnBoard = useAppSelector(selectPrepareGameMouseOnBoard);

  const setCalculatedDirection = (ship: ShipData) => {
    const box1 = ship.boxes[0];
    const box2 = ship.boxes[1];
    if (box1.x - box2.x != 0) {
      dispatch(setDirection(1));
    } else if (box1.y - box2.y != 0) {
      dispatch(setDirection(2));
    } 
  };

  const handleShipDragStart = (event: any) => {
    const matchingShip = fleet.find((ship) => {
      return ship.boxes.some((box) => {
        return box.x === props.x && box.y === props.y;
      });
    });
    if (matchingShip) {
      setCalculatedDirection(matchingShip);
      dispatch(removeShipFromFleet(matchingShip));
      dispatch(setDraggingShip(matchingShip));
    } else {
      toast.error(t('error.generic'), {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light',
      });
      event.preventDefault();
      return;
    }
  };

  const handleShipDragEnd = () => {
    if (mouseOnBoard && validateShipPosition()) {
      dispatch(pushFleet());
    }
    dispatch(setDraggingShip(null));
  };
  const validateShipPosition = (): boolean => {
    if (!draggingShip) return false;
    let result = true;
    for (const box of draggingShip.boxes) {
      if (!result) break;
      // Verificar que está dentro de los margenes validos de la tabla
      if (
        box.x < 0 ||
        box.y < 0 ||
        box.x > props.size - 1 ||
        box.y > props.size - 1
      ) {
        toast.error(t('prepareBoard.positionShip.outOfBounds'), {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'light',
        });
        result = false;
        break;
      }
      for (const ship of fleet) {
        for (const b of ship.boxes) {
          // Verificar que no colinda con otro barco
          if (
            (b.x === box.x && b.y === box.y) ||
            (b.x === box.x + 1 && b.y === box.y) ||
            (b.x === box.x - 1 && b.y === box.y) ||
            (b.x === box.x && b.y === box.y + 1) ||
            (b.x === box.x && b.y === box.y - 1) ||
            (b.x === box.x + 1 && b.y === box.y + 1) ||
            (b.x === box.x + 1 && b.y === box.y - 1) ||
            (b.x === box.x - 1 && b.y === box.y + 1) ||
            (b.x === box.x - 1 && b.y === box.y - 1)
          ) {
            toast.error(t('prepareBoard.positionShip.adjacent'), {
              position: 'top-right',
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: 'light',
            });
            result = false;
            break;
          }
        }
        if (!result) break;
      }
    }
    return result;
  };

  const hasShip = (): boolean => {
    let result = false;
    if (draggingShip) {
      draggingShip.boxes.forEach((box) => {
        if (box.x === props.x && box.y === props.y) {
          result = true;
          return;
        }
      });
    }
    return result;
  };

  const showDraggingShip = () => {
    if (!props.boxData && draggingShip) {
      let lives = 0;
      switch (draggingShip.type) {
        case ShipType.CARRIER:
          lives = 5;
          break;
        case ShipType.BATTLESHIP:
          lives = 4;
          break;
        case ShipType.SUBMARINE:
          lives = 3;
          break;
        case ShipType.DESTROYER:
          lives = 2;
          break;
      }
      const boxes: BoxData[] = [];
      for (let i = 0; i < lives; i++) {
        boxes.push({
          touched: false,
          x: props.x + (direction % 4 === 1 ? i : direction % 4 === 3 ? -i : 0),
          y: props.y + (direction % 4 === 2 ? i : direction % 4 === 0 ? -i : 0),
        });
      }
      const auxShip = { ...draggingShip };
      auxShip.boxes = boxes;
      dispatch(setDraggingShip(auxShip));
      dispatch(setMouseOnBoard(false));
    }
  };

  const getStyle = (shipType: ShipType): string => {
    switch (shipType) {
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
  };

  return (
    <div
      draggable
      onDragStart={(e) => handleShipDragStart(e)}
      onDragEnd={() => handleShipDragEnd()}
      onDragEnter={() => showDraggingShip()}
      onDrop={() => dispatch(setMouseOnBoard(true))}
      onDragOver={(event) => event.preventDefault()}
      className={`${
        props.boxData
          ? getStyle(props.boxData[1])
          : draggingShip && hasShip() && getStyle(draggingShip.type)
      }  ${styles.Box} ${styles.user}`}
    ></div>
  );
};

export default PrepareBox;
