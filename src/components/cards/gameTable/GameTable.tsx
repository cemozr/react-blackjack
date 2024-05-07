import { useEffect, useState } from "react";
import "../../../styles.scss";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../../states/store";
import { RootState } from "../../../states/store";
import { fetchDeck } from "../../../states/slices/gameSlice";
import { Button } from "../../UI/Button";

export const GameTable = () => {
  const [isStand, setIsStand] = useState<boolean>(false);
  const deck = useSelector((state: RootState) => state.gameReducer.deck);
  const playerHand = useSelector(
    (state: RootState) => state.gameReducer.playerHand
  );
  const dealerHand = useSelector(
    (state: RootState) => state.gameReducer.dealerHand
  );
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    dispatch(fetchDeck());
  }, [dispatch]);
  console.log(deck);
  console.log(playerHand);
  console.log(dealerHand);

  return (
    <>
      <div className="outer-container">
        <Button el="a" to="/" name="Return To Menu" />
        <h3 className="outer-container__score">Score: 100</h3>
      </div>
      <div className="game-container">
        <div className="dealer-container">
          {dealerHand.cards.map((card, i) => {
            return isStand ? (
              <img
                className="dealer-container__image"
                src={card.image}
                alt=""
              />
            ) : (
              <img
                className="dealer-container__image dealer-container__image--back"
                src="https://deckofcardsapi.com/static/img/back.png"
                alt="back of card image"
              />
            );
          })}
        </div>
        <div className="player-container">
          {playerHand.cards.map((card) => {
            return (
              <img
                className="player-container__image"
                src={card.image}
                alt=""
              />
            );
          })}
        </div>
      </div>
      <div className="btn-container">
        <Button el="button" name="Draw" />
        <Button el="button" name="Stand" />
      </div>
    </>
  );
};
