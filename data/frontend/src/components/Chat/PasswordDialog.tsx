import React, { useState } from "react";
import webSocketManager from "../../webSocket";
import {
  Dialog,
  DialogTitle,
  DialogActions,
  Button,
  Zoom,
  TextField,
} from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";

import { useDispatch, useSelector } from "react-redux";
import { accessStatus, userRole } from "./chatEnums";

import { addRoom } from "../../store/rooms";

type arg = {
  open: boolean;
  setOpen: any;
  roomName: string;
  role: userRole;
  createRoom: boolean;
  setNewRoomName: any;
};

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) {
  return <Zoom ref={ref} {...props} style={{ transitionDelay: "100ms" }} />;
});

export default function PasswordDialog({
  open,
  setOpen,
  roomName,
  role,
  createRoom,
  setNewRoomName
}: arg) {
  const user = useSelector((state: any) => state.user);
  const dispatch = useDispatch();
  const [password, setPassword] = useState("");

  function updatePassword(e: any) {
    setPassword(e.target.value);
  }

  function closePasswordDialog(e: any) {
    e.preventDefault();
    setOpen(false);
  }

  function confirmButton(e: any) {
    e.preventDefault();
    if (password !== "") {
      if (createRoom) {
        dispatch(
          addRoom({
            name: roomName,
            role: role,
            isDirectMsg: false,
            hasPassword: true,
            openTab: true,
            isMuted: false,
          }),
        );
        webSocketManager.getSocket().emit("joinRoom", {
          source: user.username,
          room: roomName,
          access: accessStatus.protected,
          password: password,
        });
      } else {
        webSocketManager.getSocket().emit("setPasswordToRoom", {
          room: roomName,
          password: password,
          source: user.username,
        });
      }
      setOpen(false);
      if (setNewRoomName)
        setNewRoomName("");
    }
  }

  return (
    <Dialog
      open={open}
      onClose={closePasswordDialog}
      TransitionComponent={Transition}
      keepMounted
    >
      <DialogTitle>Enter password:</DialogTitle>
      <TextField
        autoComplete='off'
        helperText="Enter password"
        label="Password"
        type="password"
        value={password}
        onChange={updatePassword}
      />
      <DialogActions>
        <Button onClick={closePasswordDialog}>Cancel</Button>
        <Button
          disabled={password === "" ? true : false}
          onClick={confirmButton}
        >
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
}
