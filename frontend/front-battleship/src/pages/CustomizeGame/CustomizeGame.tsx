import React, { FC } from 'react';
import styles from './CustomizeGame.module.css';
import { useTranslation } from 'react-i18next';
import PreviewBoard from './PreviewBoard/PreviewBoard';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import { PrepareGameRequest } from '../../api/domain/requests/PrepareGameRequest';
import { fetchGame, prepareGame } from '../../api/requests/gameAPI';
import { GameDomain } from '../../api/domain/GameDomain';
import { useNavigate, useParams } from 'react-router-dom';
import { PATH_HOME } from '../../Routes';

interface CustomizeGameProps {}

const CustomizeGame: FC<CustomizeGameProps> = () => {
  const navigate = useNavigate();
  const [boardSize, setBoardSize] = React.useState(10);
  const [preparedGame, setPreparedGame] = React.useState<GameDomain>();
  const { code } = useParams();
  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<FieldValues>();

  React.useEffect(() => {
    const getGame = async (code: string) => {
      const game = await fetchGame(code).catch(err => navigate(PATH_HOME));
      if (game)
      setPreparedGame(game);
    };
    if (code) {
      getGame(code);
    }
  }, []);

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    const request: PrepareGameRequest = {
      size: data.size,
      battleships: data.battleship,
      carriers: data.carrier,
      destroyers: data.destroyer,
      submarines: data.submarine,
    };
    const result = await prepareGame(request);
    setPreparedGame(result);
  };

  return (
    <div className='h-75'>
      <p className='title'>{t('customizeGame.title')}</p>
      {preparedGame ? (
        <div className='d-flex justify-content-center align-items-center h-100'>
          <div className='card w-50 p-3 m-auto'>
            <div className='card-body'>
              <p>Comparte este link para que se unan a tu partida:</p>
              <p>
                <a
                  target='_blank'
                  href={
                    'http://localhost:3000/customize-game/b3bb500e-0dfe-47d9-b7c7-e33fa84ffb8c'
                  }
                >
                  http://localhost:3000/customize-game/b3bb500e-0dfe-47d9-b7c7-e33fa84ffb8c
                </a>
              </p>
            </div>
          </div>
        </div>
      ) : (
        <form className='container' onSubmit={handleSubmit(onSubmit)}>
          <div className='row'>
            <div className='col-md-6 mb-3'>
              <div className='row'>
                <div className='col-md-12'>
                  <label>Tamaño del tablero</label>
                  <select
                    {...register('size')}
                    defaultValue={'10'}
                    onChange={(e) => setBoardSize(+e.target.value)}
                  >
                    <option value='5'>5x5</option>
                    <option value='10'>10x10</option>
                    <option value='15'>15x15</option>
                    <option value='20'>20x20</option>
                  </select>
                </div>
              </div>
              <div className='row mt-3'>
                <div className='col-md-6'>
                  <PreviewBoard size={boardSize} />
                </div>
              </div>
            </div>
            <div className='col-md-6'>
              <p className={styles.Barcostitle}>cantidad de barcos</p>
              <div className='row'>
                <div className='col-lg-6'>
                  <div className='row'>
                    <div className='col-lg-6'>
                      <label>{t('ships.carrier')}</label>
                    </div>
                    <div className='col-lg-6'>
                      <input
                        type='number'
                        className='w-100'
                        {...register('carrier')}
                      />
                    </div>
                  </div>
                </div>
                <div className='col-lg-6'>
                  <div className='row'>
                    <div className='col-lg-6'>
                      <label htmlFor='battleship'>
                        {t('ships.battleship')}
                      </label>
                    </div>
                    <div className='col-lg-6'>
                      <input
                        type='number'
                        className='w-100'
                        {...register('battleship')}
                        name='battleship'
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className='row mt-3'>
                <div className='col-lg-6'>
                  <div className='row'>
                    <div className='col-lg-6'>
                      <label>{t('ships.submarine')}</label>
                    </div>
                    <div className='col-lg-6'>
                      <input
                        type='number'
                        className='w-100'
                        {...register('submarine')}
                      />
                    </div>
                  </div>
                </div>
                <div className='col-lg-6'>
                  <div className='row'>
                    <div className='col-lg-6'>
                      <label>{t('ships.destroyer')}</label>
                    </div>
                    <div className='col-lg-6'>
                      <input
                        type='number'
                        className='w-100'
                        {...register('destroyer')}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='row mt-5'>
            <div className='col-12'>
              <button type='submit' className='w-100 botonJugar botonJugarAnim'>
                crear
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};

export default CustomizeGame;
