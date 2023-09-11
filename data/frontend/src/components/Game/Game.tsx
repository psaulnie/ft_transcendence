// import { exit } from 'process';
import { useState } from "react";
// import { webSocket } from '../../webSocket';
// import { WidthFull } from '@mui/icons-material';
import Matchmaking from "./Matchmaking";
import Canvas from "./Canvas";
import { Navigate, Route, Routes, useLocation } from "react-router";

// interface InterfaceProps{
//   WidthFrame:string;
//   Heigth:string;
// }

export default function Game() {
  const [foundUser, setFoundUser] = useState(false);
  const [players, setPlayers] = useState<{1: string; 2: string }>({ 1: '', 2: '' });
  const [gameRoomId, setGameRoomId] = useState("");
  const [canvasName, setBackground] = useState<string>('');
  const location = useLocation();

  if (location.pathname === "/game/play" && !foundUser) {
    return (<Navigate to="/game/matchmaking" />)
  }
  return (
    <Routes>
        <Route path="*" element={<Matchmaking setFoundUser={setFoundUser} setPlayers={setPlayers} setGameRoomId={setGameRoomId} setBackground={setBackground}/>}></Route>
        <Route path="/play" element={<Canvas players={players} gameRoomId={gameRoomId} setFoundUser={setFoundUser} canvasName={canvasName}/>}></Route>
    </Routes>
  );
}
