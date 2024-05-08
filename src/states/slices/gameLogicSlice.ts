import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { type Hand } from "./gameSlice";
import axios from "axios";

type GameLogic = {
  isStand: boolean;
  isBetOpen: boolean;
  turn: string;
  playerHandValue: number;
  dealerHandValue: number;
  chips: number;
  bet: number;
};

const initialState: GameLogic = {
  isStand: false,
  isBetOpen: true,
  turn: "player",
  playerHandValue: 0,
  dealerHandValue: 0,
  chips: 200,
  bet: 0,
};

const gameLogicSlice = createSlice({
  name: "gameLogic",
  initialState,
  reducers: {
    addBet: (state, action: PayloadAction<number>) => {
      state.bet = action.payload;
      state.chips -= state.bet;
      state.isBetOpen = false;
    },
    stand: () => {},
  },
  extraReducers: (builder) => {
    builder
      .addCase(drawCard.pending, () => {
        console.log("drawing cards...");
      })
      .addCase(drawCard.fulfilled, (state, action: PayloadAction<Hand>) => {});
  },
});

export const drawCard = createAsyncThunk(
  "gameLogic/drawCard",
  async (deck_id: string) => {
    return await axios
      .get(`https://deckofcardsapi.com/api/deck/${deck_id}/draw/?count=2`)
      .then((res) => res.data);
  }
);

export default gameLogicSlice.reducer;
export const { addBet, stand } = gameLogicSlice.actions;
