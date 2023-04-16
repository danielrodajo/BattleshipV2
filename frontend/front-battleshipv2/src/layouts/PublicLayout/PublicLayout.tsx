import React, { FC } from 'react';
import styles from './PublicLayout.module.css';
import { Outlet } from 'react-router-dom';

interface PublicLayoutProps {}

const PublicLayout: FC<PublicLayoutProps> = () => (
  <div className={styles.PublicLayout}>
    <Outlet />
  </div>
);

export default PublicLayout;
