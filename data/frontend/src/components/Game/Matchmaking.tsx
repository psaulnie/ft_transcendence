// import { exit } from 'process';
import React, { useState, useEffect } from "react";
import webSocketManager from "../../webSocket";
// import { WidthFull } from '@mui/icons-material';
// import { match } from 'assert';
import { Button } from "@mui/material";
import { useSelector } from "react-redux";

export default function Matchmaking({setFoundUser, setPlayers, setGameRoomId}: {setFoundUser: any, setPlayers: any, setGameRoomId: any}) {
  const user = useSelector((state: any) => state.user);
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
      setFoundUser(true);
      setPlayers({1: user.username, 2: value.opponent});
      setGameRoomId(value.gameRoomId);
      console.log(value);
    }

    webSocketManager.getSocket().on("matchmaking" + user.username, process);
    return () => {
      webSocketManager.getSocket().off("matchmaking" + user.username, process);
    };
  }, [user.username, setFoundUser, setPlayers]);

  return (
      !bouttonClick ? <Button onClick={startMatchmaking}>play</Button> : <div><Button onClick={cancelMatchmaking}>cancel</Button><p>Matchmaking in progress</p></div>
  );
}
