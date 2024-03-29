import {useEffect, useState} from "react";
import Matchmaking from "./Matchmaking";
import Canvas from "./Canvas";
import {Route, Routes, useLocation} from "react-router";

export default function Game() {
  const [foundUser, setFoundUser] = useState(false);
  const [players, setPlayers] = useState<{ 1: string; 2: string }>({
    1: "",
    2: "",
  });
  const [gameRoomId, setGameRoomId] = useState("");
  const [canvasName, setBackground] = useState<string>("");
  const location = useLocation();

  useEffect(() => {
    if (
      location.state &&
      location.state.background &&
      location.state.gameRoomId &&
      location.state.players
    ) {
      setFoundUser(true);
      setPlayers(location.state.players);
      setGameRoomId(location.state.gameRoomId);
      setBackground(location.state.background);
    }
  });

  if (foundUser) {
    return (
      <Canvas
        players={players}
        gameRoomId={gameRoomId}
        setFoundUser={setFoundUser}
        canvasName={canvasName}
      />
    );
  }

  return (
    <Routes>
      <Route
        path="*"
        element={
          <Matchmaking
            setFoundUser={setFoundUser}
            setPlayers={setPlayers}
            setGameRoomId={setGameRoomId}
            setBackground={setBackground}
          />
        }
      ></Route>
    </Routes>
  );
}
