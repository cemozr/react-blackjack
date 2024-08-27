import "../../styles.scss";
//hooks
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
//states
import { AppDispatch } from "../../states/store";
import { RootState } from "../../states/store";
import {
  fetchDeck,
  addBet,
  resetStates,
  drawCard,
  type Card,
  setWinnerAndStand,
  stand,
  checkChips,
  standCheck,
} from "../../states/slices/gameSlice";

//UI
import { Button } from "../UI/Button";
import chipsImage from "../../assets/chips.png";
import { ScoreCard } from "../scoreCard/ScoreCard";
import { GameOverCard } from "../gameOverCard/GameOverCard";
import { WarningCard } from "../warningCard/WarningCard";

export const GameTable = () => {
  const betRef = useRef<HTMLInputElement>(null);
  const dispatch = useDispatch<AppDispatch>();
  const isBetOpen = useSelector(
    (state: RootState) => state.gameReducer.isBetOpen
  );

  let isStand = useSelector((state: RootState) => state.gameReducer.isStand);

  const isPending = useSelector(
    (state: RootState) => state.gameReducer.isPending
  );
  const isChipsOut = useSelector(
    (state: RootState) => state.gameReducer.isChipsOut
  );
  const isBetValid = useSelector(
    (state: RootState) => state.gameReducer.isBetValid
  );
  const warningMode = useSelector(
    (state: RootState) => state.gameReducer.warningMode
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
    !isBetOpen && dispatch(fetchDeck());
  }, [dispatch, isBetOpen]);
  useEffect(() => {
    dispatch(setWinnerAndStand());
  }, [playerHandValue, dealerHandValue]);
  useEffect(() => {
    dispatch(checkChips());
    dispatch(standCheck(playerHand));
  }, [isStand]);

  const openDealerCards: Card[] = dealerHand.cards.filter((_, i) => i !== 0);

  return (
    <>
      {isBetOpen && (
        <h3 className="game-wrappper__warning-text">
          Enter your bet to continue
        </h3>
      )}
      <div className="game-wrapper">
        {warningMode && <WarningCard />}
        {isChipsOut && <GameOverCard />}
        {isStand && <ScoreCard />}
        <div className="game-table-container">
          <div className="game-container">
            <div className="score-badge">
              <p className="score-badge__text">
                {" "}
                Dealer: {isStand ? dealerHandValue : "?"}
              </p>
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
            <div className="score-badge">
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
              disabled={isBetOpen || isStand || warningMode}
              onClick={() => dispatch(drawCard(playerHand))}
            />
            <Button
              el="button"
              name="Stand"
              disabled={isBetOpen || isStand || warningMode}
              onClick={() => dispatch(stand())}
            />
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
            disabled={!isBetOpen || warningMode}
            ref={betRef}
          />
          <Button
            el="button"
            name="Bet"
            onClick={() => {
              dispatch(addBet(Number(betRef.current?.value))),
                betRef.current?.value == "";
            }}
            disabled={!isBetOpen || warningMode}
          />
          <Button
            el="a"
            to="/"
            name="Return To Menu"
            click={() => dispatch(resetStates())}
          />
        </div>
      </div>
    </>
  );
};
