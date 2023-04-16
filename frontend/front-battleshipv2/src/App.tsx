import './App.css';
import Home from './pages/Home/Home';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import PrivateLayout from './layouts/PrivateLayout/PrivateLayout';
import Ranking from './pages/Ranking/Ranking';
import {
  PATH_RANKING,
  PATH_HOME,
  PATH_GAME_MODE,
  PATH_SIGNIN,
  PATH_SIGNUP,
  PATH_PUBLIC,
  PATH_GAME,
  PATH_PREPARE_BOARD,
  PATH_MY_GAMES,
} from './utils/Routes';
import AuthSignIn from './pages/Auth/SignIn/SignIn';
import { useAppSelector, useAppDispatch } from './hooks/reduxHooks';
import {
  refreshToken,
  selectAuthRefreshToken,
  selectAuthToken,
  selectLoggedIn,
  signOut,
} from './store/slices/AuthSlice';
import AuthSignUp from './pages/Auth/SignUp/SignUp';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import { ThreeCircles } from 'react-loader-spinner';
import { hideSpinner, selectShowSpinner } from './store/slices/SpinnerSlice';
import React from 'react';
import PublicLayout from './layouts/PublicLayout/PublicLayout';
import client from './api/client';
import { ENDPOINT_REFRESH_TOKEN } from './utils/Endpoints';
import Game from './pages/GameSection/Game/Game';
import SelectMode from './pages/GameSection/SelectMode/SelectMode';
import PrepareBoard from './pages/PrepareBoard/PrepareBoard';
import MyGames from './pages/MyGames/MyGames';

function App() {
  const dispatch = useAppDispatch();
  const isLoggedIn = useAppSelector(selectLoggedIn);
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
  });

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
      <Routes>
        <Route
          path={PATH_HOME}
          element={
            isLoggedIn ? <PrivateLayout /> : <Navigate to={PATH_PUBLIC} />
          }
        >
          <Route index element={<Home />} />
          <Route path={PATH_GAME_MODE} element={<SelectMode />} />
          <Route path={PATH_MY_GAMES} element={<MyGames />} />
          <Route path={PATH_GAME} element={<Game />} />
          <Route path={PATH_RANKING} element={<Ranking />} />
          <Route path={PATH_PREPARE_BOARD} element={<PrepareBoard />} />
          <Route path='*' element={<Navigate to={PATH_HOME} />} />
        </Route>

        <Route
          path={PATH_PUBLIC}
          element={!isLoggedIn ? <PublicLayout /> : <Navigate to={PATH_HOME} />}
        >
          <Route index element={<Navigate to={PATH_SIGNIN} />} />
          <Route path={PATH_SIGNIN} element={<AuthSignIn />} />
          <Route path={PATH_SIGNUP} element={<AuthSignUp />} />
          <Route path='*' element={<Navigate to={PATH_PUBLIC} />} />
        </Route>
      </Routes>
      <ToastContainer />
    </div>
  );
}

export default App;
