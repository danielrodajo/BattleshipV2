import React, { FC } from 'react';
import styles from './Modal.module.css';
import { RiCloseLine } from 'react-icons/ri';

interface ModalProps {
  setIsOpen: (show: boolean) => void;
}

const Modal: FC<ModalProps> = ({ setIsOpen }) => {
  return (
    <>
      <div className={styles.darkBG} onClick={() => setIsOpen(false)} />
      <div className={styles.centered}>
        <div className={styles.modal}>
          <div className={styles.modalHeader}>
            <h5 className={styles.heading}>partida generada</h5>
          </div>
          <button className={styles.closeBtn} onClick={() => setIsOpen(false)}>
            <RiCloseLine style={{ marginBottom: '-3px' }} />
          </button>
          <div className={styles.modalContent}>
            <span>
              Buscar el nombre de usuario para enviarle una invitación:
            </span>
            <input className='mt-3' type='text' />
            <p className='mt-4'>O bien, envía este enlace para que se unan a tu partida:</p>
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
          <div className={styles.modalActions}>
            <div className={styles.actionsContainer}>
              <button
                className={styles.deleteBtn}
                onClick={() => setIsOpen(false)}
              >
                Delete
              </button>
              <button
                className={styles.cancelBtn}
                onClick={() => setIsOpen(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Modal;
