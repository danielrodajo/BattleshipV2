import React, { FC } from 'react';
import styles from './PrivateLayout.module.css';
import Navbar from '../../components/Navbar/Navbar';
import { Outlet } from 'react-router-dom';

interface LayoutProps {}

const Layout: FC<LayoutProps> = () => (
  <div className={styles.Layout}>
    <Navbar />
    <div className={`d-flex justify-content-center ${styles.WhiteContainer}`}>
      <div className={`${styles.body} bg-light p-1`}>
        <Outlet />
      </div>
    </div>
  </div>
);

export default Layout;
