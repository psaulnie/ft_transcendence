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
  const [opponent, setOpponent] = useState('');


  return (
    <div>
      {
        !foundUser ?  <Matchmaking setFoundUser={setFoundUser} setOpponent={setOpponent} /> : <Canvas opponent={opponent}/>
      }     
    </div>
  );
};