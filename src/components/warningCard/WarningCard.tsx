import "../../styles.scss";
import { Button } from "../UI/Button";

export const WarningCard = () => {
  return (
    <div className="warning-card-container">
      <h3>Invalid Bet!</h3>
      <h4>Please check your bet again.</h4>
      <Button name="Understood" el="button" />
    </div>
  );
};
