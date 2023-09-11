// import { exit } from 'process';
import React, { useEffect, useState } from "react";
// import { webSocket } from '../../webSocket';
// import { WidthFull } from '@mui/icons-material';
import Matchmaking from "./Matchmaking";
import Canvas from "./Canvas";
import './Game.css'

// interface InterfaceProps{
//   WidthFrame:string;
//   Heigth:string;
// }

export default function Game() {
  const [foundUser, setFoundUser] = useState(false);
  const [players, setPlayers] = useState<{1: string; 2: string }>({ 1: '', 2: '' });
  const [gameRoomId, setGameRoomId] = useState("");
  const [canvasName, setBackground] = useState<string>('');

  return (
    <div className="game">
      {
        !foundUser ?  <Matchmaking setFoundUser={setFoundUser} setPlayers={setPlayers} setGameRoomId={setGameRoomId} setBackground={setBackground}/> : <Canvas players={players} gameRoomId={gameRoomId} setFoundUser={setFoundUser} canvasName={canvasName}/>
      }
    </div>
  );
}
