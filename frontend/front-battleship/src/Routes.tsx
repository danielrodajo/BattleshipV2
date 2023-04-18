import { Routes as DOMRoutes, Route, Navigate } from 'react-router-dom';
import PrivateLayout from './layouts/PrivateLayout/PrivateLayout';
import PublicLayout from './layouts/PublicLayout/PublicLayout';
import Home from './pages/Home/Home';
import Game from './pages/GameSection/Game/Game';
import SelectMode from './pages/GameSection/SelectMode/SelectMode';
import PrepareBoard from './pages/PrepareBoard/PrepareBoard';
import MyGames from './pages/MyGames/MyGames';
import Ranking from './pages/Ranking/Ranking';
import AuthSignIn from './pages/Auth/SignIn/SignIn';
import AuthSignUp from './pages/Auth/SignUp/SignUp';
import { useAppSelector } from './hooks/reduxHooks';
import { selectLoggedIn } from './store/slices/AuthSlice';
import CustomizeGame from './pages/CustomizeGame/CustomizeGame';

export const PATH_HOME = '/';
export const PATH_RANKING = '/ranking';
export const PATH_MY_GAMES = '/my-games';
export const PATH_GAME_MODE = '/game-mode';
export const PATH_GAME = '/game/:code';
export const PATH_PREPARE_BOARD = '/game/board/:code';
export const PATH_CUSTOMIZE_GAME = '/customize-game';

export const PATH_PUBLIC = '/public';
export const PATH_SIGNIN = '/public/signin';
export const PATH_SIGNUP = '/public/signup';

export default function Routes() {
  const isLoggedIn = useAppSelector(selectLoggedIn);
    return (
        <DOMRoutes>
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
            <Route path={PATH_CUSTOMIZE_GAME} element={<CustomizeGame />} />
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
        </DOMRoutes>
    );
  }

export function passParameters(path: string, ...parameters: string[]): string {
    let auxPath = path;
    path.split('/').filter(param => param.startsWith(':')).forEach((param, i) => {
        auxPath = auxPath.replace(param, parameters[i]);
    });
    return auxPath;
}