import React, { FC } from 'react';
import styles from './CustomizeGameModal.module.css';
import ModalLayout from '../../../layouts/ModalLayout/ModalLayout';
import { FaRegClone } from 'react-icons/fa';

interface CustomizeGameModalProps {
  setIsOpen: (show: boolean) => void;
  urlGame: string;
}

const CustomizeGameModal: FC<CustomizeGameModalProps> = (props) => {
  const [showTooltip, setShowTooltip] = React.useState(false);
  const headerContent = () => {
    return <h5 className={styles.heading}>partida generada</h5>;
  };

  const actionsContent = () => {
    return (
      <>
        <button
          className={styles.deleteBtn}
          onClick={() => props.setIsOpen(false)}
        >
          Delete
        </button>
        <button
          className={styles.cancelBtn}
          onClick={() => props.setIsOpen(false)}
        >
          Cancel
        </button>
      </>
    );
  };

  const handlerClipboard = () => {
    navigator.clipboard.writeText(props.urlGame);
    setShowTooltip(true);
    setTimeout(() => {
      setShowTooltip(false);
    }, 2500);
  };

  return (
    <ModalLayout
      setIsOpen={props.setIsOpen}
      header={headerContent()}
      actions={actionsContent()}
    >
      <span>Buscar el nombre de usuario para enviarle una invitación:</span>
      <input className='mt-3' type='text' />
      <p className='mt-4'>
        O bien, envía este enlace para que se unan a tu partida:
      </p>
      <p className={styles.urlBlock}>
        <div className={styles.url}>
          <span>{props.urlGame}</span>
        </div>
        <div onClick={handlerClipboard} className={`${styles.icon} ${showTooltip && styles.tooltip}`}>
          <FaRegClone />
        </div>
      </p>
    </ModalLayout>
  );
};

export default CustomizeGameModal;
