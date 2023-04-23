import { combineReducers } from '@reduxjs/toolkit';
import authReducer from './AuthSlice';
import spinnerReducer from './SpinnerSlice';
import gameReducer from './GameSlice';
import prepareGameReducer from './PrepareGameSlice';

const rootReducer = () => {
  return combineReducers({
    authState: authReducer,
    spinnerState: spinnerReducer,
    gameState: gameReducer,
    prepareGameState: prepareGameReducer,
  });
};

export default rootReducer;
