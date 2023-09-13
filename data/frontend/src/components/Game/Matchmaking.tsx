import { useState, useEffect } from "react";
import webSocketManager from "../../webSocket";
import { Button, Grid, LinearProgress } from "@mui/material";

import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { setIsPlaying } from "../../store/user";
import { Navigate } from "react-router";

export default function Matchmaking({
  setFoundUser,
  setPlayers,
  setGameRoomId,
  setBackground,
}: {
  setFoundUser: any;
  setPlayers: any;
  setGameRoomId: any;
  setBackground: any;
}) {
  const user = useSelector((state: any) => state.user);
  const dispatch = useDispatch();
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
      dispatch(setIsPlaying(true));
      setFoundUser(true);
      setPlayers({ 1: user.username, 2: value.opponent });
      setGameRoomId(value.gameRoomId);
      setBackground(value.background);
      setLaunchGame(true);
      dispatch(setIsPlaying(true));
    }

    webSocketManager.getSocket().on("matchmaking" + user.username, process);
    return () => {
      webSocketManager.getSocket().off("matchmaking" + user.username, process);
    };
  }, [user.username, setFoundUser, setPlayers, setGameRoomId]);

  if (launchGame) {
    return <Navigate to="/game/play" />;
  }
  return (
    <Grid
      sx={{
        position: "absolute",
        left: "50%",
        top: "50%",
        transform: "translate(-50%, -50%)",
      }}
    >
      {!bouttonClick ? (
        <Button
          variant="text"
          color="primary"
          sx={{
            textTransform: "none",
            fontWeight: "bold",
            fontSize: "36px",
            width: "8em",
            height: "4em",
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            borderColor: "#000000",
            border: "1px solid",
            borderRadius: "10px",
            color: "black",
            "&:hover": {
              backgroundColor: "gray",
              borderColor: "gray",
            },
          }}
          onClick={startMatchmaking}
        >
          Start Matchmaking
        </Button>
      ) : (
        <div>
          <Button
            variant="text"
            color="primary"
            sx={{
              textTransform: "none",
              fontWeight: "bold",
              fontSize: "36px",
              width: "6em",
              height: "1.8em",
              backgroundColor: "rgba(255, 255, 255, 0.9)",
              borderColor: "#000000",
              border: "1px solid",
              borderRadius: "10px",
              color: "black",
              "&:hover": {
                backgroundColor: "gray",
                borderColor: "gray",
              },
            }}
            onClick={cancelMatchmaking}
          >
            Cancel
          </Button>
          <p>Looking for an opponent...</p>
          <LinearProgress />
        </div>
      )}
    </Grid>
  );
}
