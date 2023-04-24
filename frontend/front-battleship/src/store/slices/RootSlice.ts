import { combineReducers } from '@reduxjs/toolkit';
import authReducer from './AuthSlice';
import spinnerReducer from './SpinnerSlice';
import gameReducer from './GameSlice';
import prepareGameReducer from './PrepareGameSlice';
import i18nReducer from './I18nSlice';

const rootReducer = () => {
  return combineReducers({
    authState: authReducer,
    spinnerState: spinnerReducer,
    gameState: gameReducer,
    prepareGameState: prepareGameReducer,
    i18nState: i18nReducer
  });
};

export default rootReducer;
