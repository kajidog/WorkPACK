import { Store, combineReducers } from "redux";
import logger from "redux-logger";
import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import counterSlice, { initialState as counterState } from "./tasks";
import userSlice, { initialState as userState } from "./user";
import classroomSlice, { initialState as classroomState } from "./classroom";

// Reducerを追加した場合はここにも追加
const rootReducer = combineReducers({
  counter: counterSlice.reducer,
  user: userSlice.reducer,
  classroom: classroomSlice.reducer,
});

// Reducerを追加した場合はここにも追加
const preloadedState = () => {
  return { counter: counterState, user: userState, classroom: classroomState };
};

export type StoreState = ReturnType<typeof preloadedState>;

export type ReduxStore = Store<StoreState>;

// 一番最初の処理
const createStore = () => {
  const middlewareList = [...getDefaultMiddleware(), logger];

  return configureStore({
    reducer: rootReducer,
    middleware: middlewareList,
    devTools: process.env.NODE_ENV !== "production",
    preloadedState: preloadedState(),
  });
};

export default createStore;
