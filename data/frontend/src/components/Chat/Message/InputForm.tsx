import React, { KeyboardEvent, SyntheticEvent, useState } from "react";
import webSocketManager from "../../../webSocket";
import { sendMsgArgs } from "../args.interface";
import { sendMsgTypes } from "../args.types";
import { useSelector } from "react-redux";

import { Button, Grid, TextField } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Publish } from "@mui/icons-material";

export default function InputForm({ roomName, isDirectMessage }: {
  roomName: string;
  isDirectMessage: boolean;
}) {
  const user = useSelector((state: any) => state.user);
  const isWideScreen = useMediaQuery("(max-width:600px) or (max-height:700px)");

  const [value, setValue] = useState<sendMsgArgs>({
    type: sendMsgTypes.msg,
    source: user.username,
    target: roomName,
    data: "",
  });
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  function send() {
    if (isLoading)
      return ;
    const msg = isDirectMessage ? "sendPrivateMsg" : "sendMsg";
    setMessage("");
    setValue({
      type: sendMsgTypes.msg,
      source: user.username,
      target: roomName,
      data: "",
    });
    setIsLoading(true);
    webSocketManager
      .getSocket()
      .timeout(1000)
      .emit(msg, value, () => {
        setIsLoading(false);
      });
  }
  function keyPress(event: KeyboardEvent<HTMLButtonElement>) {
    event.preventDefault();
    if (event.key === "Enter" && value.data !== "") send();
  }

  function onSubmit(event: SyntheticEvent) {
    event.preventDefault();
    if (value.data !== "") send();
  }

  function onChange(e: any) {
    if (e.target.value.length <= 50) {
      setValue({
        type: sendMsgTypes.msg,
        source: user.username,
        target: roomName,
        data: e.target.value,
      });
      setMessage(e.target.value);
    }
  }

  return (
    <form onSubmit={onSubmit}>
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        spacing={isWideScreen ? 1 : 2}
      >
        <Grid item xs={8}>
          <TextField
            fullWidth
            value={message}
            onChange={onChange}
            autoComplete='off'
          />
        </Grid>
        <Grid item xs={2}>
          <Button
            disabled={isLoading}
            variant="contained"
            name="message"
            type="submit"
            sx={{
              width: "80px",
              "@media (max-width: 600px) or (max-height: 700px)": {
                width: "45px",
                marginRight: "0.8em",
              },

              bgcolor: "#D9D9D9",
              color: "black",
            }}
            onKeyDown={keyPress}
            endIcon={isWideScreen ? null : <Publish />}
            centerRipple
          >
            send
          </Button>
        </Grid>
      </Grid>
    </form>
  );
}
