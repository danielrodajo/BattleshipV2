import axios from 'axios';
import { RootState } from '../store/store';
import { refreshToken, signOut } from '../store/slices/AuthSlice';
import { ENDPOINT_REFRESH_TOKEN } from '../utils/Endpoints';

let store: any;

export const injectStore = (_store: any) => {
  store = _store;
};

const state = () => {
  return store.getState() as RootState;
};

const client = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

client.interceptors.request.use(
  (config) => {
    const token = state().authState.token;
    if (token && !config.url?.startsWith('/auth/')) {
      config.headers['Authorization'] = 'Bearer ' + token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

client.interceptors.response.use(
  (response) => {
    return response;
  },
  async function (error) {
    const originalRequest = error.config;
    if (error.response.status === 403 && !originalRequest._retry) {
      originalRequest._retry = true;
      const result = await client.post(ENDPOINT_REFRESH_TOKEN, {
        token: state().authState.refreshToken,
      });
      store.dispatch(refreshToken(result.data));
      return client(originalRequest);
    }
    else if (error.response.status === 401) {
      store.dispatch(signOut());
    }
    return Promise.reject(error);
  }
);

export default client;
