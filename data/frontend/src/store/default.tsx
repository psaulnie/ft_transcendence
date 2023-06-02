import { combineReducers, configureStore } from '@reduxjs/toolkit';
import user from './user';
import { apiSlice } from './api';
const reducer = combineReducers({
	user,
	[apiSlice.reducerPath]: apiSlice.reducer,
});
  
const store = configureStore({
	reducer,
	middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(apiSlice.middleware)
});

export default store;
