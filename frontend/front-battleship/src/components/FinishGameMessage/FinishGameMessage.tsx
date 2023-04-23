import React, { FC } from 'react';
import styles from './FinishGameMessage.module.css';
import { useAppDispatch } from '../../hooks/reduxHooks';
import { useTranslation } from 'react-i18next';
import { updateFinishedStatus } from '../../store/slices/GameSlice';
import { BoardState } from '../../api/domain/BoardDomain';
import { GiLaurelsTrophy } from 'react-icons/gi';

interface FinishGameMessageProps {
  finishedStatus: string | null;
  points: number | null;
}

const FinishGameMessage: FC<FinishGameMessageProps> = ({
  finishedStatus,
  points,
}) => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  return (
    <>
      {finishedStatus && (
        <div
          className={styles.FinishedContainer}
          onClick={() => dispatch(updateFinishedStatus(null))}
        >
          <div>
            <div>
              {[
                ...(finishedStatus === BoardState[BoardState.WIN]
                  ? t('game.win')
                  : t('game.lose')),
              ].map((l, i) => (
                <span
                  key={`${l}-${i}`}
                  className={`${styles.FinishedText} ${
                    finishedStatus === BoardState[BoardState.WIN]
                      ? styles.text1
                      : styles.text2
                  }`}
                >
                  {l}
                </span>
              ))}
            </div>
            {points !== null && (
              <div
                className={`d-flex justify-content-center align-items-center ${
                  styles.SmoothPoints
                } ${
                  points > 0
                    ? styles.SumPoints
                    : points < 0 && styles.MinusPoints
                }`}
              >
                <span className='me-3'>
                  {points > 0 && '+'}
                  {points}
                </span>
                <GiLaurelsTrophy />
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default FinishGameMessage;
