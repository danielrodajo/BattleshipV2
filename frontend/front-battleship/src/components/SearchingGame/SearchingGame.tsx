import React, { FC } from 'react';
import styles from './SearchingGame.module.css';
import { ThreeDots } from 'react-loader-spinner';
import { useTranslation } from 'react-i18next';

interface SearchingGameProps {
  searching: boolean;
  disconnect: () => void;
}
const SearchingGame: FC<SearchingGameProps> = ({ searching, disconnect }) => {
  const { t } = useTranslation();

  const addSpan = (text: any) => {
    return [...text].map((letter, i) => (
      <span key={`${letter}-${i}`}>{letter}</span>
    ));
  };

  return (
    <div
      className={` ${!searching && styles.HideSearching} ${
        styles.Searching
      } h-100 d-flex justify-content-center align-items-center`}
    >
      <div className='container'>
        <div className='row'>
          <div className={`col-12 text-center ${styles.TextSpinner}`}>
            {addSpan(t('selectGame.searching'))}
          </div>
        </div>
        <div className='row'>
          <div className='col-12 d-flex justify-content-center align-items-center'>
            <ThreeDots
              height='80'
              width='80'
              radius='9'
              color='#6e30b4'
              ariaLabel='three-dots-loading'
              wrapperStyle={{}}
              visible={true}
            />
          </div>
        </div>
        <div className='row'>
          <div className='col-12 d-flex justify-content-center align-items-center'>
            <button onClick={() => disconnect()}>Salir de la cola</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchingGame;
