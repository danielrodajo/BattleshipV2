import React, { FC } from 'react';
import styles from './PreviewBoard.module.css';
import PrepareBox from '../../../components/PrepareBox/PrepareBox';

interface PreviewBoardProps {
  size: number;
}

const PreviewBoard: FC<PreviewBoardProps> = (props) => {

  const columns = {
    gridTemplateColumns: 'repeat(' + props.size + ', 1fr)',
  };
  return (
    <div className={styles.Wrapper} style={columns}>
      {Array.from(Array(props.size)).map((n, y) => (
        <React.Fragment key={`board-${y}`}>
          {Array.from(Array(props.size)).map((n, x) => (
            <PrepareBox
            size={props.size}
              key={`${y}-${x}`}
              x={x}
              y={y}
            />
          ))}
        </React.Fragment>
      ))}
    </div>
  );
};

export default PreviewBoard;
