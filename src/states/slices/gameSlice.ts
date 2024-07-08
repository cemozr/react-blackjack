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
export type Card = {
  code: string;
  image: string;
  images: {
    svg: string;
    png: string;
  };
  value: string;
  suit: string;
};
export type Hand = {
  success: boolean;
  deck_id: string;
  cards: Card[];
  remaining: number;
};

type BaseSetup = {
  deck: Deck;
  playerHand: Hand;
  dealerHand: Hand;
};

type GameState = BaseSetup & {
  isPending: boolean;
  isStand: boolean;
  isBetOpen: boolean;
  turn: "player" | "dealer";
  playerHandValue: number;
  dealerHandValue: number;
  chips: number;
  bet: number;
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
  isPending: false,
  isStand: false,
  isBetOpen: true,
  turn: "player",
  playerHandValue: 0,
  dealerHandValue: 0,
  chips: 200,
  bet: 0,
};
let playerTotalPoint: number = 0;
let dealerTotalPoint: number = 0;

const gameSlice = createSlice({
  name: "game",
  initialState,
  reducers: {
    addBet: (state, action: PayloadAction<number>) => {
      state.bet = action.payload;
      state.chips -= state.bet;
      state.isBetOpen = false;
      state.turn = "player";
    },

    stand: () => {},
    resetStates: () => {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDeck.pending, (state) => {
        state.isPending = true;
        console.log("waiting for the deck");
      })
      .addCase(
        fetchDeck.fulfilled,
        (state, action: PayloadAction<BaseSetup>) => {
          state.isPending = false;
          state.deck = action.payload.deck;
          state.playerHand = action.payload.playerHand;
          state.dealerHand = action.payload.dealerHand;

          state.playerHand.cards.forEach((card) => {
            switch (card.value) {
              case "KING":
              case "QUEEN":
              case "JACK":
                playerTotalPoint += 10;
                break;
              case "ACE":
                playerTotalPoint <= 10
                  ? (playerTotalPoint += 11)
                  : (playerTotalPoint += 1);
                break;
              default:
                playerTotalPoint += +card.value;
            }
          });
          state.playerHandValue += playerTotalPoint;
          state.dealerHand.cards.forEach((card) => {
            switch (card.value) {
              case "KING":
              case "QUEEN":
              case "JACK":
                dealerTotalPoint += 10;
                break;
              case "ACE":
                dealerTotalPoint <= 10
                  ? (dealerTotalPoint += 11)
                  : (dealerTotalPoint += 1);
                break;
              default:
                dealerTotalPoint += +card.value;
            }
          });
          state.dealerHandValue += dealerTotalPoint;
        }
      )
      .addCase(fetchDeck.rejected, () => {
        console.log("error");
        throw new Error();
      });
    builder
      .addCase(drawCard.pending, (state) => {
        state.isPending = true;
        console.log("drawing card");
      })
      .addCase(drawCard.fulfilled, (state, action: PayloadAction<Hand>) => {
        const playerDraw = action.payload.cards[0];
        const dealerDraw = action.payload.cards[1];
        state.isPending = false;
        state.playerHand.cards.push(action.payload.cards[0]);
        //---------------------------------------------------------------------------------

        switch (playerDraw.value) {
          case "KING":
          case "QUEEN":
          case "JACK":
            playerTotalPoint += 10;
            break;
          case "ACE":
            playerTotalPoint <= 10
              ? (playerTotalPoint += 11)
              : (playerTotalPoint += 1);
            break;
          default:
            playerTotalPoint += +playerDraw.value;
        }

        state.playerHandValue = playerTotalPoint;
        //---------------------------------------------------------------------------------
        if (dealerTotalPoint <= 17) {
          state.dealerHand.cards.push(action.payload.cards[1]);
          switch (dealerDraw.value) {
            case "KING":
            case "QUEEN":
            case "JACK":
              dealerTotalPoint += 10;
              break;
            case "ACE":
              dealerTotalPoint <= 10
                ? (dealerTotalPoint += 11)
                : (dealerTotalPoint += 1);
              break;
            default:
              dealerTotalPoint += +dealerDraw.value;
          }

          state.dealerHandValue = dealerTotalPoint;
        }
      });
  },
});

export const drawCard = createAsyncThunk(
  "game/drawCard",
  async (playerHand: Hand) => {
    return await axios
      .get(
        `https://deckofcardsapi.com/api/deck/${playerHand.deck_id}/draw/?count=2`
      )
      .then((res) => res.data);
  }
);

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
export const { addBet, stand, resetStates } = gameSlice.actions;
