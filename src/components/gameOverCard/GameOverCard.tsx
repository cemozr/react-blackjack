import { resetStates } from "../../states/slices/gameSlice";
import "../../styles.scss";
import { Button } from "../UI/Button";
import { useDispatch } from "react-redux";

export const GameOverCard = () => {
  const dispatch = useDispatch();
  return (
    <div className="game-over-card-container">
      <h3>Game Over T_T </h3>
      <h4>Sorry, You don't have any chips.</h4>
      <Button
        name="Return To Menu"
        el="a"
        to="/"
        click={() => dispatch(resetStates())}
      />
    </div>
  );
};
