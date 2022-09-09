import { combineReducers } from '@reduxjs/toolkit';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import modalReducer from './slices/modal';
import movieReducer from './slices/movie';
import subscriptionReducer from './slices/sutbscription';
import privateSettingsReducer from './slices/privateSettings';
import searchReducer from './slices/search';
import profilesReducer from './slices/profiles';

const persistConfig = {
  key: 'root',
  version: 1,
  storage,
};

export const rootReducer = combineReducers({
  modal: modalReducer,
  movie: movieReducer,
  subscription: subscriptionReducer,
  privateSettings: privateSettingsReducer,
  search: searchReducer,
  profiles: profilesReducer,
});

export const persistedReducer = persistReducer(persistConfig, rootReducer);
