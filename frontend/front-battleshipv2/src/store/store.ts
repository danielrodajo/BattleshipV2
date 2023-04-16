import { configureStore } from '@reduxjs/toolkit';
import logger from 'redux-logger';
import storage from 'redux-persist/lib/storage';
import { persistReducer } from 'redux-persist';
import rootReducer from './slices/RootSlice';

const persistConfig = {
  key: 'root',
  storage,
  // Indicar que REDUCERS queremos persistir (de no indicarlo, guardará todos)
  whitelist: ['authState'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer());

export const appReduxStore = configureStore({
  reducer: persistedReducer,
  // Implementar Thunk por defecto
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: false
  }).concat(logger),
});

export type AppDispatch = typeof appReduxStore.dispatch;
export type RootState = ReturnType<typeof appReduxStore.getState>;
