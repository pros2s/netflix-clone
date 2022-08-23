import { combineReducers } from '@reduxjs/toolkit';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import modalReducer from './slices/modal';

const persistConfig = {
  key: 'root',
  version: 1,
  storage,
};

export const rootReducer = combineReducers({
  modal: modalReducer,
});

export const persistedReducer = persistReducer(persistConfig, rootReducer);
