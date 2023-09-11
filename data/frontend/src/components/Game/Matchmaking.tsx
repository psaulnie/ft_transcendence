// import { exit } from 'process';
import { useState, useEffect } from "react";
import webSocketManager from "../../webSocket";
// import { WidthFull } from '@mui/icons-material';
// import { match } from 'assert';
import { Button } from "@mui/material";
import { useSelector } from "react-redux";
import { Navigate } from "react-router";

export default function Matchmaking({setFoundUser, setPlayers, setGameRoomId, setBackground}: {setFoundUser: any, setPlayers: any, setGameRoomId: any, setBackground: any}) {
  const user = useSelector((state: any) => state.user);
  const [bouttonClick, setButtonClick] = useState(false);
  const [launchGame, setLaunchGame] = useState(false);
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
      setBackground(value.background);
      setLaunchGame(true);
      console.log(value);
    }

    webSocketManager.getSocket().on("matchmaking" + user.username, process);
    return () => {
      webSocketManager.getSocket().off("matchmaking" + user.username, process);
    };
  }, [user.username, setFoundUser, setPlayers, setGameRoomId]);

  if (launchGame) {
    return (<Navigate to="/game/play" />)
  }
  return (
      !bouttonClick ? <Button onClick={startMatchmaking}>play</Button> : <div><Button onClick={cancelMatchmaking}>cancel</Button><p>Matchmaking in progress</p></div>
  );
}
