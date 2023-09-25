import {combineReducers, configureStore} from "@reduxjs/toolkit";
import user from "./user";
import rooms from "./rooms";
import {apiSlice} from "./api";

const reducer = combineReducers({
  user,
  rooms,
  [apiSlice.reducerPath]: apiSlice.reducer,
});

const store = configureStore({
  reducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: {
        extraArgument: user,
      },
      serializableCheck: false,
    }).concat(apiSlice.middleware),
});

export default store;
