import { exit } from 'process';
import React, { useState, useEffect, useRef } from 'react';
import { webSocket } from '../../webSocket';
import { WidthFull } from '@mui/icons-material';
import { match } from 'assert';
import { Button } from '@mui/material';
import { useSelector } from 'react-redux';

export default function Matchmaking({setFoundUser, setPlayers}: {setFoundUser: any, setPlayers: any}) {
  const user = useSelector((state: any) => state.user);
  const [bouttonClick, setButtonClick] = useState(false);

  function startMatchmaking() {
    setButtonClick(true);
    webSocket.emit("matchmaking", {username: user.username});
  }
  
  function cancelMatchmaking() {
    setButtonClick(false);
    webSocket.emit("cancelMatchmaking", {username: user.username});
  }

	useEffect(() => {

		function process(value: any) {
      setFoundUser(true);
      setPlayers({1: user.username, 2: value.opponent});
      console.log(value);
		}

		webSocket.on("matchmaking" + user.username, process);
		return () => {
			webSocket.off("matchmaking" + user.username, process);
		};
	}, [user.username]);

  return (
      !bouttonClick ? <Button onClick={startMatchmaking}>play</Button> : <Button onClick={cancelMatchmaking}>cancel</Button>
  );
};
