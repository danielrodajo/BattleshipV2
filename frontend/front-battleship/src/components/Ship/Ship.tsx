import React, { FC } from 'react';
import styles from './Ship.module.css';
import { ShipData } from '../../api/data/ShipData';
import { ShipType } from '../../api/domain/ShipDomain';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks';
import {
  pushFleet,
  selectPrepareGameDirection,
  selectPrepareGameDraggingShip,
  selectPrepareGameFleet,
  selectPrepareGameMouseOnBoard,
  moveDirection,
  setDraggingShip,
} from '../../store/slices/PrepareGameSlice';
import { toast } from 'react-toastify';

interface ShipProps {
  type: ShipType;
  img: string;
  amount: number;
  size: number;
}

const Ship: FC<ShipProps> = (props) => {
  const dispatch = useAppDispatch();
  const fleet = useAppSelector(selectPrepareGameFleet);
  const draggingShip = useAppSelector(selectPrepareGameDraggingShip);
  const direction = useAppSelector(selectPrepareGameDirection);
  const mouseOnBoard = useAppSelector(selectPrepareGameMouseOnBoard);
  const { t } = useTranslation();

  const handleShipDragStart = (event: any) => {
    if (calculateAmount() < 1) {
      toast.error(t('prepareBoard.positionShip.maxShipType'), {
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
    const ship: ShipData = {
      boxes: [],
      type: props.type,
    };
    dispatch(setDraggingShip(ship));
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

  const calculateAmount = (): number => {
    return props.amount - fleet.filter((ship) => ship.type === props.type).length;
  };

  const parseShipType = (): string => {
    switch (props.type) {
      case ShipType.CARRIER:
        return t('ships.carrier');
      case ShipType.BATTLESHIP:
        return t('ships.battleship');
      case ShipType.SUBMARINE:
        return t('ships.submarine');
      default:
        return t('ships.destroyer');
    }
  };

  const rotateImg = {
    transform: 'rotate(' + (direction - 1) * 90 + 'deg)',
  };

  return (
    <div
      className={`${styles.Ship} d-flex justify-content-center align-items-center`}
    >
      <div>
        <p>{`${parseShipType()} x${calculateAmount()}`}</p>
        <img
          className={styles.ShipImg}
          style={rotateImg}
          src={props.img}
          width={100}
          alt={`Imagen de ${parseShipType()}`}
          draggable
          onDragStart={(e) => handleShipDragStart(e)}
          onDragEnd={() => handleShipDragEnd()}
        />
      </div>
    </div>
  );
};

export default Ship;
