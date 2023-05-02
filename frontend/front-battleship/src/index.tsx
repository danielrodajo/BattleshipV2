import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import App from './App';
import reportWebVitals from './reportWebVitals';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import { appReduxStore } from './store/store';
import { PersistGate } from 'redux-persist/integration/react';
import { persistStore } from 'redux-persist';
import { injectStore } from './api/client';
import './i18n/i18n';
import { GoogleOAuthProvider } from '@react-oauth/google';

injectStore(appReduxStore);
const container = document.getElementById('root')!;
const root = createRoot(container);
const persistor = persistStore(appReduxStore);

root.render(
  <GoogleOAuthProvider clientId='118701604002-ouhpmteo4spo0sgo85h7c3l3qp0r7ujv.apps.googleusercontent.com'>
    <PersistGate persistor={persistor}>
      <Provider store={appReduxStore}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Provider>
    </PersistGate>
  </GoogleOAuthProvider>
);

reportWebVitals();
