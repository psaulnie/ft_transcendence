import { exit } from 'process';
import React, { useState, useEffect, useRef } from 'react';
import { webSocket } from '../../webSocket';
import { WidthFull } from '@mui/icons-material';
import Matchmaking from './Matchmaking';
import Canvas from './Canvas';

// interface InterfaceProps{
//   WidthFrame:string;
//   Heigth:string;
// }

export default function Game() {

  const [foundUser, setFoundUser] = useState(false);
  const [players, setPlayers] = useState<{1: string; 2: string }>({ 1: '', 2: '' });


  return (
    <div>
      {
        !foundUser ?  <Matchmaking setFoundUser={setFoundUser} setPlayers={setPlayers} /> : <Canvas players={players}/>
      }     
    </div>
  );
};