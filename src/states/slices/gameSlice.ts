import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const fetchDeckUrl =
  "https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=6";

type Deck = {
  success: boolean;
  deck_id: string;
  remaining: number;
  shuffled: boolean;
};
type Card = {
  code: string;
  image: string;
  images: {
    svg: string;
    png: string;
  };
  value: string;
  suit: string;
};
type Hand = {
  success: boolean;
  deck_id: string;
  cards: Card[];
  remaining: number;
};

type GameState = {
  deck: Deck;
  playerHand: Hand;
  dealerHand: Hand;
};
const initialState: GameState = {
  deck: {
    success: false,
    deck_id: "",
    remaining: 0,
    shuffled: false,
  },
  playerHand: {
    success: false,
    deck_id: "",
    cards: [
      {
        code: "",
        image: "",
        images: {
          svg: "",
          png: "",
        },
        value: "",
        suit: "",
      },
      {
        code: "",
        image: "",
        images: {
          svg: "",
          png: "",
        },
        value: "",
        suit: "",
      },
    ],
    remaining: 0,
  },
  dealerHand: {
    success: false,
    deck_id: "",
    cards: [
      {
        code: "",
        image: "",
        images: {
          svg: "",
          png: "",
        },
        value: "",
        suit: "",
      },
      {
        code: "",
        image: "",
        images: {
          svg: "",
          png: "",
        },
        value: "",
        suit: "",
      },
    ],
    remaining: 0,
  },
};

const gameSlice = createSlice({
  name: "game",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDeck.pending, () => {
        console.log("waiting for the deck");
      })
      .addCase(
        fetchDeck.fulfilled,
        (state, action: PayloadAction<GameState>) => {
          state.deck = action.payload.deck;
          state.playerHand = action.payload.playerHand;
          state.dealerHand = action.payload.dealerHand;
        }
      )
      .addCase(fetchDeck.rejected, () => {
        console.log("error");
        throw new Error();
      });
  },
});

export const fetchDeck = createAsyncThunk("game/fetchDeck", async () => {
  const deck: Deck = await axios
    .get(fetchDeckUrl)
    .then((response) => response.data);
  const playerHand: Hand = await axios
    .get(`https://deckofcardsapi.com/api/deck/${deck.deck_id}/draw/?count=2`)
    .then((response) => response.data);
  const dealerHand: Hand = await axios
    .get(`https://deckofcardsapi.com/api/deck/${deck.deck_id}/draw/?count=2`)
    .then((response) => response.data);
  return { deck, playerHand, dealerHand };
});

export default gameSlice.reducer;
