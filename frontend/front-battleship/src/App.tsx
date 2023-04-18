import './App.css';
import { useLocation } from 'react-router-dom';
import Routes from './Routes';
import { useAppSelector, useAppDispatch } from './hooks/reduxHooks';
import {
  refreshToken,
  selectAuthRefreshToken,
  selectAuthToken,
  signOut,
} from './store/slices/AuthSlice';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import { ThreeCircles } from 'react-loader-spinner';
import { hideSpinner, selectShowSpinner } from './store/slices/SpinnerSlice';
import React from 'react';
import client from './api/client';
import { ENDPOINT_REFRESH_TOKEN } from './utils/Endpoints';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const dispatch = useAppDispatch();
  const token = useAppSelector(selectAuthToken);
  const rToken = useAppSelector(selectAuthRefreshToken);
  const showSpinner = useAppSelector(selectShowSpinner);

  const parseJwt = (token: string) => {
    try {
      return JSON.parse(window.atob(token.split('.')[1]));
    } catch (e) {
      return null;
    }
  };

  React.useEffect(() => {
    if (token) {
      const decodedJwt = parseJwt(token);

      if (decodedJwt.exp * 1000 < Date.now()) {
        client
          .post(ENDPOINT_REFRESH_TOKEN, {
            token: rToken,
          })
          .then((result) => dispatch(refreshToken(result.data)))
          .catch((err) => {
            console.error(err);
            dispatch(signOut());
          });
      }
    }
  }, []);

  // Desactivar spinner cada vez que se navegue entre paginas para evitar dejarlo activado residualmente
  let location = useLocation();
  React.useEffect(() => {
    dispatch(hideSpinner());
  }, [location, dispatch]);

  return (
    <div className='App'>
      <ThreeCircles
        height='200'
        width='200'
        color='#9E44CF'
        wrapperStyle={{}}
        wrapperClass='spinner'
        visible={showSpinner}
        ariaLabel='three-circles-rotating'
        outerCircleColor='#8023B6'
        innerCircleColor='#8017BA'
        middleCircleColor='#8023B6'
      />
      <span className='square1'></span>
      <span className='square2'></span>
      <span className='square3'></span>
      <Routes />
      <ToastContainer />
    </div>
  );
}

export default App;
