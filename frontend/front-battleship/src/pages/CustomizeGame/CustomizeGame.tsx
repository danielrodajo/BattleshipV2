import React, { FC } from 'react';
import styles from './CustomizeGame.module.css';
import { useTranslation } from 'react-i18next';
import PreviewBoard from './PreviewBoard/PreviewBoard';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import { PrepareGameRequest } from '../../api/domain/requests/PrepareGameRequest';
import { prepareGame } from '../../api/requests/gameAPI';
import { useNavigate, useParams } from 'react-router-dom';
import { PATH_JOIN_GAME, passParameters } from '../../Routes';
import Modal from '../../components/ModalImpl/CustomizeGameModal/CustomizeGameModal';
import { InvitationDomain } from '../../api/domain/InvitationDomain';

interface CustomizeGameProps {}

const CustomizeGame: FC<CustomizeGameProps> = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const navigate = useNavigate();
  const [boardSize, setBoardSize] = React.useState(10);
  const [invitation, setInvitation] = React.useState<InvitationDomain>();
  const { code } = useParams();
  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<FieldValues>();

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    const request: PrepareGameRequest = {
      size: data.size,
      battleships: data.battleship,
      carriers: data.carrier,
      destroyers: data.destroyer,
      submarines: data.submarine,
    };
    const result = await prepareGame(request);
    setInvitation(result);
    setIsOpen(true);
  };

  return (
    <div className='h-75'>
      {isOpen && invitation && (
        <Modal
          setIsOpen={setIsOpen}
          urlGame={`${window.location.protocol}//${window.location.host}${passParameters(PATH_JOIN_GAME, invitation.code)}`}
        />
      )}
      <p className='title'>{t('customizeGame.title')}</p>
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
                    <label htmlFor='battleship'>{t('ships.battleship')}</label>
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
    </div>
  );
};

export default CustomizeGame;
