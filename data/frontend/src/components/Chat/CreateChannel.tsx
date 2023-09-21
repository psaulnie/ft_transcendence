import React, { useEffect, useState } from "react";

import webSocketManager from "../../webSocket";
import { accessStatus, userRole } from "./chatEnums";
import { useDispatch, useSelector } from "react-redux";
import { useLazyGetIsRoomNameTakenQuery } from "../../store/api";
import { addRoom } from "../../store/rooms";
import { Grid, Typography } from "@mui/material";

import {
  TextField,
  Select,
  MenuItem,
  FormControl,
  FormHelperText,
  SelectChangeEvent,
  IconButton,
  InputLabel,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import PasswordDialog from "./PasswordDialog";

function CreateChannel() {
  const user = useSelector((state: any) => state.user);
  const rooms = useSelector((state: any) => state.rooms);

  const [newRoomName, setNewRoomName] = useState("");
  const [access, setAccess] = useState(accessStatus.public);
  const [showDialog, setShowDialog] = useState(false);

  function updateNewRoomName(e: any) {
    e.preventDefault();
    if (e.target.value.length <= 10) {
      setNewRoomName(e.target.value);
    }

  }

  function changeAccess(event: SelectChangeEvent) {
    event.preventDefault();
    if (event.target.value === "public") setAccess(accessStatus.public);
    else if (event.target.value === "private") setAccess(accessStatus.private);
    else if (event.target.value === "password")
      setAccess(accessStatus.protected);
  }

  function createRoom(event: any) {
    event.preventDefault();
    if (
      !rooms.room.find(
        (obj: { name: string; role: userRole, isDirectMsg: boolean }) => obj.name === newRoomName && obj.isDirectMsg === false,
      )
    ) {
      if (access === accessStatus.protected) {
        setShowDialog(true);
        return;
      }
      webSocketManager.getSocket().emit("createRoom", {
        source: user.username,
        room: newRoomName,
        access: access,
      });
    } else alert("You are currently in this channel");
    setNewRoomName("");
  }

  return (
    <Grid className="createChannel">
      <Typography sx={{ marginTop: "2em" }}>Create a new channel</Typography>
      <TextField
        autoComplete='off'
        label="Room name"
        value={newRoomName}
        onChange={updateNewRoomName}
        autoFocus
      />
      <FormControl sx={{ height: "80%" }}>
        <InputLabel>Access</InputLabel>
        <Select name="roomAccess" onChange={changeAccess} defaultValue="">
          <MenuItem defaultChecked value="public">
            Public
          </MenuItem>
          <MenuItem value="private">Private</MenuItem>
          <MenuItem value="password">Password</MenuItem>
        </Select>
        <FormHelperText>Channel access</FormHelperText>
      </FormControl>
      <IconButton
        name="rooms"
        onClick={createRoom}
        sx={{ transform: "translate(0%, 18%)" }}
      >
        <AddIcon />
      </IconButton>
      {showDialog ? (
        <PasswordDialog
          open={showDialog}
          setOpen={setShowDialog}
          roomName={newRoomName}
          role={userRole.owner}
          createRoom={true}
          setNewRoomName={setNewRoomName}
        />
      ) : null}
    </Grid>
  );
}

export default CreateChannel;
