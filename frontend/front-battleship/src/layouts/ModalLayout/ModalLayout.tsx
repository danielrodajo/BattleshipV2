import React, { FC } from 'react';
import styles from './ModalLayout.module.css';
import { RiCloseLine } from 'react-icons/ri';

interface ModalLayoutProps {
  setIsOpen: (show: boolean) => void;
  header: React.ReactNode;
  children: React.ReactNode;
  actions: React.ReactNode;
}

const ModalLayout: FC<ModalLayoutProps> = (props) => {
  return (
    <>
      <div className={styles.darkBG} onClick={() => props.setIsOpen(false)} />
      <div className={styles.centered}>
        <div className={styles.modal}>
          <div className={styles.modalHeader}>{props.header}</div>
          <button
            className={styles.closeBtn}
            onClick={() => props.setIsOpen(false)}
          >
            <RiCloseLine style={{ marginBottom: '-3px' }} />
          </button>
          <div className={styles.modalContent}>{props.children}</div>
          <div className={styles.modalActions}>
            <div className={styles.actionsContainer}>{props.actions}</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ModalLayout;
