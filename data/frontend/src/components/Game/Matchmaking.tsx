import { exit } from 'process';
import React, { useState, useEffect, useRef } from 'react';
import { webSocket } from '../../webSocket';
import { WidthFull } from '@mui/icons-material';
import { match } from 'assert';
import { Button } from '@mui/material';
import { useSelector } from 'react-redux';

export default function Matchmaking({setFoundUser, setOpponent}: {setFoundUser: any, setOpponent: any}) {
  const user = useSelector((state: any) => state.user);

  function startMatchmaking() {
    webSocket.emit("matchmaking", {username: user.username});
  }
  

	useEffect(() => {

		function process(value: any) {
      setFoundUser(true);
      setOpponent(value.opponent);
      console.log(value);
		}

		webSocket.on("matchmaking" + user.username, process);
		return () => {
			webSocket.off("matchmaking" + user.username, process);
		};
	}, [user.username]);

  return (
    <Button onClick={startMatchmaking}>Play</Button>
  )
};
