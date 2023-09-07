import React, { useState } from "react";

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
import ErrorSnackbar from "../Global/ErrorSnackbar";
import Loading from "../Global/Loading";

function CreateChannel() {
  const user = useSelector((state: any) => state.user);
  const rooms = useSelector((state: any) => state.rooms);
  const dispatch = useDispatch();

  const [newRoomName, setNewRoomName] = useState("");
  const [access, setAccess] = useState(accessStatus.public);
  const [showDialog, setShowDialog] = useState(false);

  const [trigger, result] = useLazyGetIsRoomNameTakenQuery();

  if (result.isError) return <ErrorSnackbar error={result.error} />;
  else if (result.isLoading) return (<Loading />);

  function updateNewRoomName(e: any) {
    e.preventDefault();
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
    <Grid className="createChannel">
      <Typography sx={{ marginTop: "2em" }}>Create a new channel</Typography>
      <TextField
        autoComplete='off'
        error={result.data}
        helperText={result.data ? "This room already exists" : null}
        label="Room name"
        value={newRoomName}
        onChange={updateNewRoomName}
      />
      <FormControl sx={{ height: "80%" }}>
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
      {result.data === true ? <p>This room already exist</p> : null}
    </Grid>
  );
}

export default CreateChannel;
