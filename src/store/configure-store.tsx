import { configureStore } from '@reduxjs/toolkit';
import logger from 'redux-logger';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';

import RootReducer from '@store/reducers';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  timeout: 10000,
  version: 1,
  whitelist: ['current_screen', 'translation', 'theme', "user"],
};

const persistedReducer = persistReducer(persistConfig, RootReducer);

let middlewares: any[] = [];

// if (__DEV__) {
//   middlewares = [logger];
// }

const appStore = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(middlewares),
});

const persistor = persistStore(appStore);

export {
  appStore,
  persistor,
};