import { configureStore } from "@reduxjs/toolkit";
import gameReducer from "./slices/gameSlice";
import gameLogicReducer from "./slices/gameLogicSlice";

export const store = configureStore({
  reducer: { gameReducer, gameLogicReducer },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
