import "../../../styles.scss";
//hooks
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
//states
import { AppDispatch } from "../../../states/store";
import { RootState } from "../../../states/store";
import { fetchDeck, type Card } from "../../../states/slices/gameSlice";
import { addBet, drawCard } from "../../../states/slices/gameLogicSlice";
//UI
import { Button } from "../../UI/Button";
import chipsImage from "../../../assets/chips.png";

export const GameTable = () => {
  const betRef = useRef<HTMLInputElement>(null);
  const dispatch = useDispatch<AppDispatch>();

  const isBetOpen = useSelector(
    (state: RootState) => state.gameLogicReducer.isBetOpen
  );
  const isStand = useSelector(
    (state: RootState) => state.gameLogicReducer.isStand
  );
  const deck = useSelector((state: RootState) => state.gameReducer.deck);
  const chips = useSelector((state: RootState) => state.gameLogicReducer.chips);
  const playerHand = useSelector(
    (state: RootState) => state.gameReducer.playerHand
  );
  const dealerHand = useSelector(
    (state: RootState) => state.gameReducer.dealerHand
  );

  useEffect(() => {
    dispatch(fetchDeck());
  }, [dispatch]);
  console.log(deck);
  console.log(playerHand);
  console.log(dealerHand);

  const openDealerCards: Card[] = dealerHand.cards.filter((_, i) => i !== 0);
  console.log(betRef.current?.value);
  return (
    <>
      <div className="outer-container">
        <Button el="a" to="/" name="Return To Menu" />
        <h3 className="outer-container__score">Chips: {chips}</h3>
      </div>
      <div className="game-wrapper">
        <div className="game-table-container">
          <div className="game-container">
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
                return (
                  <img
                    key={i}
                    className="dealer-container__image"
                    src={card.image}
                    alt=""
                  />
                );
              })}
            </div>
            <div className="player-container">
              {playerHand.cards.map((card, i) => {
                return (
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
              onClick={() => dispatch(drawCard(deck.deck_id))}
            />
            <Button el="button" name="Stand" disabled={isBetOpen} />
          </div>
        </div>
        <div className="bet-container">
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
