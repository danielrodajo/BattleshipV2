import { FC } from 'react';
import styles from './GameMode.module.css';

interface GameModeProps {
  title: string;
  bodyLines: string[];
  playButton: string;
  handlePlay: () => void;
}

const GameMode: FC<GameModeProps> = (props) => {

  return (
    <div className={`card ${styles.GameMode}`}>
      <div
        className={`card-header d-flex justify-content-center align-items-center ${styles.Title}`}
      >
        <p className='card-title text-uppercase m-1'>{props.title}</p>
      </div>
      <div className='card-body d-flex justify-content-center align-items-center'>
        {props.bodyLines && props.bodyLines.length && (
          <ul className='list-group list-group-flush'>
            {props.bodyLines.map((line) => (
              <li key={line} className='list-group-item my-2'>
                {line}
              </li>
            ))}
          </ul>
        )}
      </div>
      <div
        className={`card-footer text-center py-2 ${styles.PlayBtn}`}
        onClick={props.handlePlay}
      >
        {props.playButton}
      </div>
    </div>
  );
};

export default GameMode;
