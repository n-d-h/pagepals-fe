import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';

import { persistReducer } from 'redux-persist';
import {
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  REHYDRATE,
} from 'redux-persist/es/constants';
import {
  createStateSyncMiddleware,
  initMessageListener,
} from 'redux-state-sync';
import authReducer from './slices/authSlice';
import { loadingReducer } from './slices/loadingSlice';
import localStorage from 'redux-persist/es/storage';
import { settingReducer } from './slices/settingsSlice';

// NORMAL REDUX
const reducer = {
  auth: authReducer,
  loading: loadingReducer,
  settings: settingReducer,
};

// PERSIST REDUX
const persistConfig = {
  key: 'root',
  version: 1,
  storage: localStorage,
};

const appReducer = combineReducers(reducer);

const rootReducer = (state, action) => {
  if (action.type === 'auth/signOut') {
    localStorage.removeItem('persist:root');
    return appReducer(undefined, action);
  }

  return appReducer(state, action);
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

// SYNC REDUX

const BlackListedActions = [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER];

const stateSyncConfig = {
  blacklist: ['loading'],
};

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [...BlackListedActions],
      },
    }).concat(createStateSyncMiddleware(stateSyncConfig)),
});

initMessageListener(store);
setupListeners(store.dispatch);
