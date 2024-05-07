import "../../../styles.scss";
import { Button } from "../../UI/Button";

export const MainMenu = () => {
  return (
    <>
      <h1>Blackjack Card Game</h1>
      <Button name="Start Game" type="button" el="a" to="/game" />
      <Button name="How To Play" type="button" el="a" to="/rules" />
    </>
  );
};
