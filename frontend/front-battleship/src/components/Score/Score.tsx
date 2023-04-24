import React, { FC } from 'react';
import styles from './Score.module.css';
import { RankingResponse } from '../../api/domain/responses/RankingResponse';
import { useTranslation } from 'react-i18next';

interface ScoreProps {
  ranking: RankingResponse[];
}

const Score: FC<ScoreProps> = ({ ranking }) => {
  const {t} = useTranslation();
  return (
    <>
      <table className={`${styles.Score} table table-striped`}>
        <thead>
          <tr>
            <th scope='col' className='text-capitalize'>{t('ranking.position')}</th>
            <th scope='col' className='text-capitalize'>{t('ranking.player')}</th>
            <th scope='col' className='text-capitalize'>{t('ranking.games')}</th>
            <th scope='col' className='text-capitalize'>{t('ranking.points')}</th>
          </tr>
        </thead>
        <tbody className=''>
          {ranking.sort((a, b) => b.points - a.points).map((r, i) => (
              <tr key={`${r.nickname}-${i}`}>
                <th>{i + 1}</th>
                <td>{r.nickname}</td>
                <td>{r.games}</td>
                <td>{r.points}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </>
  );
};

export default Score;
