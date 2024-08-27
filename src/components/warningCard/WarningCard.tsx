import "../../styles.scss";
import { Button } from "../UI/Button";
import { RootState } from "../../states/store";
import { useSelector, useDispatch } from "react-redux";
import { endWarning } from "../../states/slices/gameSlice";

export const WarningCard = () => {
  const dispatch = useDispatch();
  const isBetValid = useSelector(
    (state: RootState) => state.gameReducer.isBetValid
  );
  return (
    <div className="warning-card-container">
      <h3>Invalid Bet!</h3>
      <h4>Please check your bet again.</h4>
      <Button
        name="Understood"
        el="button"
        onClick={() => dispatch(endWarning())}
      />
    </div>
  );
};
