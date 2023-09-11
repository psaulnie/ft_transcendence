// import { exit } from 'process';
import React, { useState, useEffect } from "react";
import webSocketManager from "../../webSocket";
// import { WidthFull } from '@mui/icons-material';
// import { match } from 'assert';
import { Button } from "@mui/material";

import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { setIsPlaying } from "../../store/user";

export default function Matchmaking({setFoundUser, setPlayers, setGameRoomId, setBackground}: {setFoundUser: any, setPlayers: any, setGameRoomId: any, setBackground: any}) {
  const user = useSelector((state: any) => state.user);
  const dispatch = useDispatch();
  const [bouttonClick, setButtonClick] = useState(false);

  function startMatchmaking() {
    setButtonClick(true);
    webSocketManager
      .getSocket()
      .emit("matchmaking", { username: user.username });
  }

  function cancelMatchmaking() {
    setButtonClick(false);
    webSocketManager
      .getSocket()
      .emit("cancelMatchmaking", { username: user.username });
  }

  useEffect(() => {
    function process(value: any) {
      dispatch(setIsPlaying(true));
      setFoundUser(true);
      setPlayers({1: user.username, 2: value.opponent});
      setGameRoomId(value.gameRoomId);
      setBackground(value.background);
      dispatch(setIsPlaying(true));
      console.log(value);
    }

    webSocketManager.getSocket().on("matchmaking" + user.username, process);
    return () => {
      webSocketManager.getSocket().off("matchmaking" + user.username, process);
    };
  }, [user.username, setFoundUser, setPlayers, setGameRoomId]);

  return (
      !bouttonClick ? <Button onClick={startMatchmaking}>play</Button> : <div><Button onClick={cancelMatchmaking}>cancel</Button><p>Matchmaking in progress</p></div>
  );
}
