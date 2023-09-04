import React, { useState } from "react";

import webSocketManager from "../../webSocket";
import { accessStatus, userRole } from "./chatEnums";
import { useDispatch, useSelector } from "react-redux";
import { useLazyGetIsRoomNameTakenQuery } from "../../store/api";
import { addRoom } from "../../store/rooms";

import Error from "../Global/Error";

import {
  TextField,
  Select,
  MenuItem,
  FormControl,
  FormHelperText,
  SelectChangeEvent,
  IconButton,
  InputLabel,
  Skeleton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import PasswordDialog from "./PasswordDialog";

function CreateChannel() {
  const user = useSelector((state: any) => state.user);
  const rooms = useSelector((state: any) => state.rooms);
  const dispatch = useDispatch();

  const [newRoomName, setNewRoomName] = useState("");
  const [access, setAccess] = useState(accessStatus.public);
  const [showDialog, setShowDialog] = useState(false);

  const [trigger, result] = useLazyGetIsRoomNameTakenQuery();

  if (result.isError) throw new (Error as any)("API call error");
  else if (result.isLoading)
    return (
      <div>
        <Skeleton variant="text" />
        <Skeleton variant="rectangular" />
      </div>
    );

  function updateNewRoomName(e: any) {
    if (e.target.value.length > 0) trigger({ roomName: e.target.value });
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
        (obj: { name: string; role: userRole }) => obj.name === newRoomName,
      )
    ) {
      let hasPassword = false;
      if (access === accessStatus.protected) {
        setShowDialog(true);
        hasPassword = true;
        return;
      }
      dispatch(
        addRoom({
          name: newRoomName,
          role: userRole.owner,
          isDirectMsg: false,
          hasPassword: hasPassword,
          openTab: true,
          isMuted: false,
        }),
      );
      webSocketManager.getSocket().emit("joinRoom", {
        source: user.username,
        room: newRoomName,
        access: access,
      });
    } else alert("You are currently in this channel");
    setNewRoomName("");
  }

  return (
    <div className="createChannel">
      <p>Create a new channel</p>
      <TextField
        error={result.data}
        helperText={result.data ? "This room already exists" : null}
        label="Room name"
        value={newRoomName}
        onChange={updateNewRoomName}
      />
      <FormControl>
        <InputLabel>Access</InputLabel>
        <Select name="roomAccess" onChange={changeAccess} defaultValue="">
          <MenuItem defaultChecked value="public">
            Public
          </MenuItem>
          <MenuItem value="private">Private</MenuItem>
          <MenuItem value="password">Password-protected</MenuItem>
        </Select>
        <FormHelperText>Channel access</FormHelperText>
      </FormControl>
      <IconButton
        name="rooms"
        disabled={result.data === true || newRoomName === ""}
        onClick={createRoom}
      >
        <AddIcon />
      </IconButton>
      {showDialog === true ? (
        <PasswordDialog
          open={showDialog}
          setOpen={setShowDialog}
          roomName={newRoomName}
          role={userRole.owner}
          createRoom={true}
        />
      ) : null}
      {result.data === true ? <p>This room already exist</p> : null}
    </div>
  );
}

export default CreateChannel;
