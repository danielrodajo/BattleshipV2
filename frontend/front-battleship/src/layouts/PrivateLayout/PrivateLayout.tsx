import React, { FC } from 'react';
import styles from './PrivateLayout.module.css';
import Navbar from '../../components/Navbar/Navbar';
import { Outlet, useLocation } from 'react-router-dom';

interface LayoutProps {}

const Layout: FC<LayoutProps> = (props) => {
  const regex = /^\/game\/[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/;
  const location = useLocation();
  return (
    <div className={styles.Layout}>
      <Navbar />
      <div className={`d-flex justify-content-center ${styles.WhiteContainer}`}>
        <div className={`${regex.test(location.pathname) ? styles.fullbody : styles.body} bg-light p-1`}>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;
