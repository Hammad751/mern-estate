import { combineReducers, configureStore } from '@reduxjs/toolkit'
import userReducer from './user/userSlice'
import {persistReducer, persistStore} from 'redux-persist'
import storage from 'redux-persist/lib/storage'


const rootReducer = combineReducers({user: userReducer});

const persistConfig = {
    key: 'root',
    storage,
    version: 1,
}
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  // our reducer is empty, so we add the reducer which we have created
  reducer: persistedReducer,

  // we don't have any reducer yet, so we create it here.
  // we have to add searilizable check. for this we will add middleware
  middleware: (getDefaultMddleware) => getDefaultMddleware({
    serializableCheck: false,
  }),

});

export const persistor = persistStore(store);