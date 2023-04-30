import React, { FC } from 'react';
import styles from './Board.module.css';
import Box from '../Box/Box';
import { letters } from '../../utils/Constants';
import { EmptyBoxDomain } from '../../api/domain/EmptyBoxDomain';
import { FleetData } from '../../pages/GameSection/Game/Game';
import { hasShip } from '../../utils/Utils';
import { Coordinates } from '../../hooks/useFleetHandler';

interface BoardProps {
  isOpponent: boolean;
  size: number;
  fleet: FleetData;
  disable?: boolean;
  onClick?: (x: number, y: number) => void;
  highLightBox?: Coordinates;
}

const Board: FC<BoardProps> = (props) => {
  const boardId = `${props.isOpponent ? 'B' : 'A'}-board`;

  const hasEmptyBox = (x: number, y: number): EmptyBoxDomain | undefined => {
    let result: EmptyBoxDomain | undefined = undefined;
    if (props.fleet) {
      const filteredBox = props.fleet.emptyBoxes.filter(
        (box) => box.x === x && box.y === y
      );
      if (filteredBox && filteredBox.length === 1) {
        result = filteredBox[0];
      }
    }
    return result;
  };

  const columns = {
    gridTemplateColumns: 'repeat(' + props.size + ', 1fr)',
  };

  return (
    <div className={styles.Board}>
      <div className={styles.WrapperParent}>
        <div className={styles.WrapperVertical}>
          <div className='text-end pe-2 invisible'>{props.size}</div>
        </div>
        <div className={styles.Wrapper} style={columns}>
          {Array.from(Array(props.size)).map((n, index) => (
            <div key={`boardth-${index}`} className='text-center fw-bolder'>
              {letters[index]}
            </div>
          ))}
        </div>
      </div>
      <div className={styles.WrapperParent}>
        <div className={styles.WrapperVertical}>
          {Array.from(Array(props.size)).map((n, y) => (
            <div
              key={`board-${y}`}
              className='fw-bold pe-2 d-flex justify-content-end align-items-center'
            >
              {y + 1}
            </div>
          ))}
        </div>
        <div className={styles.Wrapper} style={columns}>
          {Array.from(Array(props.size)).map((n, y) => (
            <React.Fragment key={`board-${y}`}>
              {Array.from(Array(props.size)).map((n, x) => (
                <Box
                  boxData={hasShip(props.fleet, x, y)}
                  emptyBoxData={hasEmptyBox(x, y)}
                  key={`${boardId}-${y}-${x}`}
                  isOpponent={props.isOpponent}
                  disable={props.disable}
                  onClick={props.onClick}
                  highlight={props.highLightBox && props.highLightBox.x === x && props.highLightBox.y === y}
                  x={x}
                  y={y}
                />
              ))}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Board;
