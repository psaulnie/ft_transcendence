import React, { useState } from "react";
import Matchmaking from "./Matchmaking";
import MatchmakingPU from "./MatchmakingPU";
import Canvas from "./Canvas";
import CanvasPU from "./CanvasPU";
import { Button } from '@mui/material';
import webSocketManager from '../../webSocket';

export default function Game() {
  const [foundUser, setFoundUser] = useState(false);
  const [matchmaking, setMatchmaking] = useState(false);
  const [players, setPlayers] = useState<{1: string; 2: string }>({ 1: '', 2: '' });
  const [gameRoomId, setGameRoomId] = useState("");

  
  const [foundUserPU, setFoundUserPU] = useState(false);
  const [matchmakingPU, setMatchmakingPU] = useState(false);
  const [playersPU, setPlayersPU] = useState<{1: string; 2: string }>({ 1: '', 2: '' });
  const [gameRoomIdPU, setGameRoomIdPU] = useState("");

  return (
      <div>
        {
          !foundUser ?  <Matchmaking setFoundUser={setFoundUser} setPlayers={setPlayers} setGameRoomId={setGameRoomId} setMatchmaking={setMatchmaking}/> : <Canvas players={players} gameRoomId={gameRoomId} setFoundUser={setFoundUser}/>
        } 
        {
          !foundUserPU ?  <MatchmakingPU setFoundUserPU={setFoundUserPU} setPlayersPU={setPlayersPU} setGameRoomIdPU={setGameRoomIdPU} setMatchmakingPU={setMatchmakingPU}/> : <CanvasPU playersPU={playersPU} gameRoomIdPU={gameRoomIdPU} setFoundUserPU={setFoundUserPU}/>
        }
      </div>
  );
}