import { combineReducers } from '@reduxjs/toolkit';
import authReducer from './AuthSlice';
import spinnerReducer from './SpinnerSlice';
import gameReducer from './GameSlice';

const rootReducer = () => {
  return combineReducers({
    authState: authReducer,
    spinnerState: spinnerReducer,
    gameState: gameReducer
  });
};

export default rootReducer;
