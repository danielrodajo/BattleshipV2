import { FC } from 'react';
import styles from './Record.module.css';
import { RecordData } from '../../api/data/RecordData';
import { useAppSelector } from '../../hooks/reduxHooks';
import { selectUserData } from '../../store/slices/AuthSlice';
import { useTranslation } from 'react-i18next';
import { Coordinates } from '../../services/FleetGenerator';
import { letters } from '../../utils/Constants';

interface RecordProps {
  records: RecordData[];
  modified: boolean;
  setHistory: (x: string, y: number, owner?: string) => void;
  focus: Coordinates | null;
}

const Record: FC<RecordProps> = (props) => {
  const {t} = useTranslation();
  const user = useAppSelector(selectUserData);
  return (
    <div className={`${styles.Record} h-100 p-2 border`}>
      <p className={`${styles.Title} border-bottom pb-1`}>{t('record.title')}</p>
      <div className={`${styles.RecordBox}`}>
        <div className={`${styles.RecordChildBox}`}>
        {props.records.map((r, i) => (
          <span
            onClick={() => props.setHistory(r.x, r.y, r.player?.nickname)}
            className={`${
              r.player?.nickname !== user!.nickname && 'bg-secondary text-light'
            } ${styles.RecordSpan} ${r.type === 'BOX' && styles.RecordHits} ${(props.focus && props.focus.x === letters.indexOf(r.x) && props.focus.y === (r.y-1) && props.focus.owner === r.player?.nickname) && styles.FocusRecord} d-inline-block me-2 my-1 border p-1`}
            key={`${r.x}-${r.y}-${r.player?.nickname}`}
          >
            {i+1} - {r.x} {r.y}
          </span>
        ))}
        </div>
      </div>
      <button disabled={!props.modified} className='mt-3 w-100 btn btn-info'>
      {t('record.btn')}
      </button>
    </div>
  );
};

export default Record;
