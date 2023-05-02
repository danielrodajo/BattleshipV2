import './App.css';
import { useLocation } from 'react-router-dom';
import Routes from './Routes';
import { useAppSelector, useAppDispatch } from './hooks/reduxHooks';
import {
  refreshToken,
  selectAuthRefreshToken,
  selectAuthToken,
  signOut,
  updateUserPoints,
} from './store/slices/AuthSlice';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import { ThreeCircles } from 'react-loader-spinner';
import { hideSpinner, selectShowSpinner } from './store/slices/SpinnerSlice';
import React from 'react';
import 'react-toastify/dist/ReactToastify.css';
import { fetchRefreshToken } from './api/requests/authAPI';
import { parseJwt } from './utils/Utils';
import { selectI18nLang } from './store/slices/I18nSlice';
import useLanguageHandler from './hooks/useLanguageHandler';

function App() {
  const { changeLanguage } = useLanguageHandler();
  const dispatch = useAppDispatch();
  const token = useAppSelector(selectAuthToken);
  const rToken = useAppSelector(selectAuthRefreshToken);
  const showSpinner = useAppSelector(selectShowSpinner);
  const lang = useAppSelector(selectI18nLang);

  React.useEffect(() => {
    changeLanguage(lang);
    async function refresh() {
      const result = await fetchRefreshToken(rToken!);
      if (result) {
        dispatch(refreshToken(result));
      } else {
        dispatch(signOut());
      }
    }

    if (token) {
      const decodedJwt = parseJwt(token);

      if (decodedJwt.exp * 1000 < Date.now()) {
        refresh();
      } else {
        dispatch(updateUserPoints());
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
