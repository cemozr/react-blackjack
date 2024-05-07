import "../../../styles.scss";
import { GameTable } from "../../cards/gameTable/GameTable";

export const GamePage = () => {
  return (
    <>
      <h2 className="game-title">Blackjack Card Game</h2>
      <GameTable />
    </>
  );
};
