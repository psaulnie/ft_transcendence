// import { exit } from 'process';
import React, { useState, useEffect } from "react";
import webSocketManager from "../../webSocket";
import { Button } from "@mui/material";
import { useSelector } from "react-redux";

export default function MatchmakingPU({setFoundUserPU, setPlayersPU, setGameRoomIdPU, setMatchmakingPU}: {setFoundUserPU: any, setPlayersPU: any, setGameRoomIdPU: any, setMatchmakingPU: any}) {
  const user = useSelector((state: any) => state.user);
  const [bouttonClick, setButtonClick] = useState(false);

  function startMatchmaking() {
    setMatchmakingPU(true);
    setButtonClick(true);
    webSocketManager
      .getSocket()
      .emit("matchmakingPU", { username: user.username });
  }

  function cancelMatchmaking() {
    setMatchmakingPU(false);
    setButtonClick(false);
    webSocketManager
      .getSocket()
      .emit("cancelMatchmakingPU", { username: user.username });
  }

  useEffect(() => {
    function process(value: any) {
      setFoundUserPU(true);
      setPlayersPU({1: user.username, 2: value.opponent});
      setGameRoomIdPU(value.gameRoomId);
      // console.log(value);
    }

    webSocketManager.getSocket().on("matchmakingPU" + user.username, process);
    return () => {
      webSocketManager.getSocket().off("matchmakingPU" + user.username, process);
    };
  }, [user.username, setFoundUserPU, setPlayersPU]);

  return (
      !bouttonClick ? <Button onClick={startMatchmaking}>play with power up</Button> : <div><Button onClick={cancelMatchmaking}>cancel</Button><p>Matchmaking in progress</p></div>
  );
}
