import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "../store";

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
  isChipsOut: boolean;
  isBetValid: boolean;
  isSync: boolean;
  warningMode: boolean;
  turn: "player" | "dealer";
  playerHandValue: number;
  dealerHandValue: number;
  chips: number;
  bet: number;
  winner: "player" | "dealer" | "draw" | "";
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
  isChipsOut: false,
  isBetValid: true,
  isSync: false,
  warningMode: false,
  turn: "player",
  playerHandValue: 0,
  dealerHandValue: 0,
  chips: 200,
  bet: 0,
  winner: "",
};
let playerTotalPoint: number = 0;
let dealerTotalPoint: number = 0;

const gameSlice = createSlice({
  name: "game",
  initialState,
  reducers: {
    addBet: (state, action: PayloadAction<number>) => {
      if (action.payload > state.chips) {
        state.isBetValid = false;
        state.warningMode = true;
      } else {
        state.bet = action.payload;
        state.chips -= state.bet;
        state.isBetOpen = false;
        state.turn = "player";
      }
    },
    endWarning: (state) => {
      state.warningMode = false;
    },
    resetStates: () => {
      return initialState;
    },
    setWinnerAndStand: (state) => {
      if (state.playerHandValue > 21 && state.dealerHandValue > 21) {
        state.isStand = true;
        state.winner = "draw";
      } else if (state.playerHandValue == 21 && state.dealerHandValue == 21) {
        state.isStand = true;
        state.winner = "draw";
      } else if (state.playerHandValue > 21) {
        state.isStand = true;
        state.winner = "dealer";
      } else if (state.playerHandValue == 21) {
        state.isStand = true;
        state.winner = "player";
      } else if (state.dealerHandValue > 21) {
        state.isStand = true;
        state.winner = "player";
      } else if (state.dealerHandValue == 21) {
        state.isStand = true;
        state.winner = "dealer";
      }
    },
    stand: (state) => {
      state.isStand = true;
      if (state.playerHandValue > state.dealerHandValue) {
        state.winner = "player";
      } else if (state.playerHandValue < state.dealerHandValue) {
        state.winner = "dealer";
      } else if (state.playerHandValue == state.dealerHandValue) {
        state.winner = "draw";
      }
    },
    calculateChips: (state, action: PayloadAction<number>) => {
      state.isStand = !state.isStand;
      state.isBetOpen = true;
      switch (state.winner) {
        case "player":
          state.chips += action.payload;
          break;
        case "draw":
          state.chips += action.payload / 2;
          break;
        case "dealer":
          state.chips = state.chips;
          break;
      }
      state.playerHand.cards = [];
      state.dealerHand.cards = [];
      state.playerHandValue = 0;
      state.dealerHandValue = 0;
      playerTotalPoint = 0;
      dealerTotalPoint = 0;
    },
    checkChips: (state) => {
      if (state.chips <= 0 && state.winner == "dealer") {
        state.isChipsOut = true;
      }
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
          console.log(state.isBetOpen);
          state.deck = action.payload.deck;
          state.playerHand.cards = [];
          state.dealerHand.cards = [];
          state.playerHandValue = 0;
          state.dealerHandValue = 0;
          playerTotalPoint = 0;
          dealerTotalPoint = 0;

          if (!state.isChipsOut) {
            state.isPending = false;
            state.playerHand = action.payload.playerHand;
            state.dealerHand = action.payload.dealerHand;
          }

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
        //drawing cards and calculating hands
        const playerDraw = action.payload.cards[0];
        const dealerDraw = action.payload.cards[1];
        state.isPending = false;
        state.playerHand.cards.push(action.payload.cards[0]);
        //------xxxx----

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
    builder
      .addCase(standCheck.pending, (state) => {
        state.isPending = true;
        console.log("drawing card");
      })
      .addCase(standCheck.fulfilled, (state, action: PayloadAction<Hand>) => {
        state.isPending = false;

        if (
          state.isStand &&
          state.dealerHandValue <= 17 &&
          state.dealerHandValue < state.playerHandValue
        ) {
          state.dealerHand.cards.push(action.payload.cards[0]);
          const newCard =
            state.dealerHand.cards[state.dealerHand.cards.length - 1];
          switch (newCard.value) {
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
              dealerTotalPoint += +newCard.value;
          }
          state.dealerHandValue = dealerTotalPoint;
          state.isSync = true;
        }
      });
  },
});

export const standCheck = createAsyncThunk(
  "game/standCheck",
  async (playerHand: Hand) => {
    return await axios
      .get(
        `https://deckofcardsapi.com/api/deck/${playerHand.deck_id}/draw/?count=2`
      )
      .then((res) => res.data);
  }
);

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
export const {
  addBet,
  resetStates,
  calculateChips,
  setWinnerAndStand,
  stand,
  checkChips,
  endWarning,
} = gameSlice.actions;
