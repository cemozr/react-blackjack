import "../../../styles.scss";
//hooks
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
//states
import { AppDispatch } from "../../../states/store";
import { RootState } from "../../../states/store";
import {
  fetchDeck,
  addBet,
  resetStates,
  drawCard,
  type Card,
  stand,
} from "../../../states/slices/gameSlice";

//UI
import { Button } from "../../UI/Button";
import chipsImage from "../../../assets/chips.png";

export const GameTable = () => {
  const betRef = useRef<HTMLInputElement>(null);
  const dispatch = useDispatch<AppDispatch>();

  const isBetOpen = useSelector(
    (state: RootState) => state.gameReducer.isBetOpen
  );

  const isStand = useSelector((state: RootState) => state.gameReducer.isStand);
  const isPending = useSelector(
    (state: RootState) => state.gameReducer.isPending
  );
  const deck = useSelector((state: RootState) => state.gameReducer.deck);
  const chips = useSelector((state: RootState) => state.gameReducer.chips);

  const playerHand = useSelector(
    (state: RootState) => state.gameReducer.playerHand
  );
  const dealerHand = useSelector(
    (state: RootState) => state.gameReducer.dealerHand
  );
  const playerHandValue = useSelector(
    (state: RootState) => state.gameReducer.playerHandValue
  );
  const dealerHandValue = useSelector(
    (state: RootState) => state.gameReducer.dealerHandValue
  );
  useEffect(() => {
    dispatch(fetchDeck());
  }, [dispatch]);
  // console.log(deck);
  console.log(playerHand);
  console.log(dealerHand);

  const openDealerCards: Card[] = dealerHand.cards.filter((_, i) => i !== 0);
  // console.log(betRef.current?.value);
  return (
    <>
      <div className="game-wrapper">
        <Button
          el="a"
          to="/"
          name="Return To Menu"
          click={() => dispatch(resetStates())}
        />

        <div className="game-table-container">
          <div className="game-container">
            <div className="score-badge btn">
              <p className="score-badge__text"> Dealer: {dealerHandValue}</p>
            </div>
            <div className="dealer-container">
              {isStand ? (
                <img
                  className="dealer-container__image"
                  src={dealerHand.cards[0].image}
                  alt=""
                />
              ) : (
                <img
                  className="dealer-container__image dealer-container__image--back"
                  src="https://deckofcardsapi.com/static/img/back.png"
                  alt="back of card image"
                />
              )}

              {openDealerCards.map((card, i) => {
                return isPending ? (
                  <div className="lds-hourglass"></div>
                ) : (
                  <img
                    key={i}
                    className="dealer-container__image"
                    src={card.image}
                    alt=""
                  />
                );
              })}
            </div>
            <div className="score-badge btn ">
              <p className="score-badge__text">Player: {playerHandValue}</p>
            </div>
            <div className="player-container">
              {playerHand.cards.map((card, i) => {
                return isPending ? (
                  <div className="animation-wrapper">
                    <div className="lds-hourglass"></div>
                  </div>
                ) : (
                  <img
                    key={i}
                    className="player-container__image"
                    src={card.image}
                    alt=""
                  />
                );
              })}
            </div>
          </div>
          <div className="btn-container">
            <Button
              el="button"
              name="Draw"
              disabled={isBetOpen}
              onClick={() => dispatch(drawCard(playerHand))}
            />
            <Button el="button" name="Stand" disabled={isBetOpen} />
          </div>
        </div>
        <div className="bet-container">
          <h3 className="bet-container__score">Chips: {chips}</h3>
          <img className="bet-container__chips-image" src={chipsImage} alt="" />
          <input
            type="number"
            placeholder="0"
            className="bet-container__bet-input"
            autoFocus={isBetOpen}
            disabled={!isBetOpen}
            ref={betRef}
          />
          <Button
            el="button"
            name="Bet"
            onClick={() => {
              dispatch(addBet(Number(betRef.current?.value))),
                betRef.current?.value == "";
            }}
            disabled={!isBetOpen}
          />
        </div>
      </div>
    </>
  );
};
