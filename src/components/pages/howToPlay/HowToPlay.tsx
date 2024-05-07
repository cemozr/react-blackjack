import "../../../styles.scss";
import { Button } from "../../UI/Button";

export const HowToPlay = () => {
  return (
    <>
      <h1>How To Play</h1>
      <ul>
        <li>Draw cards!</li>
        <li>Try to get a number close to 21 as possible!</li>
        <li>Jack, Queen, King counts 10!</li>
        <li>Ace counts 1 or 11. So choose your next move wisely!</li>
        <li>Don't overrun 21!</li>
        <li>Don't forget to check your oppenent's hand!</li>
        <li>If you think you have a good hand stand and let the cards open!</li>
        <li>And of course have fun!</li>
      </ul>
      <Button el="a" name="Return To Menu" to="/" />
    </>
  );
};
