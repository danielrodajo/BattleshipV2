import React, { FC } from 'react';
import styles from './PrepareBoard.module.css';
import { FleetData } from '../../pages/GameSection/Game/Game';
import { letters } from '../../utils/Constants';
import PrepareBox from '../PrepareBox/PrepareBox';
import { hasShip } from '../../utils/Utils';

interface PrepareBoardProps {
  size: number;
  fleet: FleetData;
}

const PrepareBoard: FC<PrepareBoardProps> = (props) => {

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
                <PrepareBox
                size={props.size}
                  boxData={hasShip(props.fleet, x, y)}
                  key={`${y}-${x}`}
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

export default PrepareBoard;
