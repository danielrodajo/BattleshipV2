import { FC } from 'react';
import styles from './GameSection.module.css';
import Board from '../Board/Board';
import { FleetData } from '../../pages/GameSection/Game/Game';
import { MdOutlineSignalWifiConnectedNoInternet4 } from 'react-icons/md';
import { Coordinates } from '../../hooks/useFleetHandler';

interface GameSectionProps {
  playerName: string;
  isOpponent: boolean;
  size: number;
  fleet: FleetData;
  disable: boolean;
  onClick?: (x: number, y: number) => void;
  online?: boolean[] | null;
  highLightBox?: Coordinates;
}

const GameSection: FC<GameSectionProps> = (props) => {
  return (
    <div className={styles.GameSection}>
      {props.online && props.online.length > 3 && (
        <div className={styles.disconnected}>
          <MdOutlineSignalWifiConnectedNoInternet4 />
        </div>
      )}
      <div
        className={`${styles.nameSection} ${
          props.disable ? styles.opponent : styles.user
        } mb-3`}
      >
        {props.playerName}{' '}
        {(props.online && props.online.length > 0) &&
          (props.online.length > 3 ? ' DESCONECTADO' : 'RECONECTANDO')}
      </div>
      <Board
        onClick={props.onClick}
        disable={props.disable}
        fleet={props.fleet}
        isOpponent={props.isOpponent}
        size={props.size}
        highLightBox={props.highLightBox}
      />
    </div>
  );
};

export default GameSection;
