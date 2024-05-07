import { Route, Routes } from "react-router-dom";
import "./styles.scss";
import { MainMenu } from "./components/pages/mainMenu/MainMenu";
import { EndGamePage } from "./components/pages/EndGamePage/EndGamePage";
import { ErrorPage } from "./components/pages/errorPage/ErrorPage";
import { GamePage } from "./components/pages/gamePage/GamePage";
import { HowToPlay } from "./components/pages/howToPlay/HowToPlay";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<MainMenu />} />
        <Route path="/rules" element={<HowToPlay />} />
        <Route path="/game" element={<GamePage />} />
        <Route path="/end-game" element={<EndGamePage />} />
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </>
  );
}

export default App;
