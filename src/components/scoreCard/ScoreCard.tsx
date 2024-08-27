import "../../styles.scss";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../../states/store";
import { Button } from "../UI/Button";
import { calculateChips, fetchDeck } from "../../states/slices/gameSlice";
import { GameOverCard } from "../gameOverCard/GameOverCard";

export const ScoreCard = () => {
  const dispatch = useDispatch<AppDispatch>();
  const winner = useSelector((state: RootState) => state.gameReducer.winner);
  const prize: number = useSelector(
    (state: RootState) => state.gameReducer.bet * 2
  );
  const dealerHandValue = useSelector(
    (state: RootState) => state.gameReducer.dealerHandValue
  );
  const playerHandValue = useSelector(
    (state: RootState) => state.gameReducer.playerHandValue
  );
  const isChipsOut = useSelector(
    (state: RootState) => state.gameReducer.isChipsOut
  );
  const isBetOpen = useSelector(
    (state: RootState) => state.gameReducer.isBetOpen
  );
  return (
    <div className="score-card-container">
      {winner == "player" ? (
        <>
          <h3>You Won!</h3> <br /> <h3>+{prize} Chips</h3>
        </>
      ) : winner == "dealer" ? (
        <h3>You Lost Nice Try!</h3>
      ) : (
        winner === "draw" && <h3>Draw!</h3>
      )}

      <div className="score-box">
        <p className="score-box__text">Dealer: {dealerHandValue}</p>
      </div>
      <div className="score-box">
        <p className="score-box__text">Player: {playerHandValue}</p>
      </div>
      <Button
        onClick={() => {
          dispatch(calculateChips(prize));
        }}
        style={{ width: "18rem" }}
        el="button"
        name="Deal The Cards"
      />
    </div>
  );
};
