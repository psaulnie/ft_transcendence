import React, { useState, useEffect } from "react";

import webSocketManager from "../../webSocket";
import { useSelector, useDispatch } from "react-redux";
import { useGetRoomsListQuery } from "../../store/api";
import { accessStatus, userRole } from "./chatEnums";
import { addRoom } from "../../store/rooms";

import PasswordDialog from "./PasswordDialog";
import Error from "../Global/Error";

import {
  FormControl,
  FormHelperText,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  IconButton,
  Grid,
} from "@mui/material";
import { Skeleton } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import LockIcon from "@mui/icons-material/Lock";
import VisibilityIcon from "@mui/icons-material/Visibility";

function JoinChannel() {
  const user = useSelector((state: any) => state.user);
  const rooms = useSelector((state: any) => state.rooms);
  const dispatch = useDispatch();

  const [newRoomName, setNewRoomName] = useState("");
  const [showDialog, setShowDialog] = useState(false);
  const [access, setAccess] = useState(0);

  function changeSelectedRoom(event: SelectChangeEvent) {
    event.preventDefault();
    setNewRoomName(event.target.value);
  }

  function joinRoom(event: any) {
    event.preventDefault();
    if (newRoomName === "") return;
    if (
      !rooms.room.find(
        (obj: { name: string; role: userRole }) => obj.name === newRoomName,
      )
    ) {
      if (access === accessStatus.protected) {
        setShowDialog(true);
        return;
      }
      dispatch(
        addRoom({
          name: newRoomName,
          role: userRole.none,
          isDirectMsg: false,
          hasPassword: access === accessStatus.protected,
          openTab: true,
          isMuted: false,
        }),
      );
      webSocketManager.getSocket().emit("joinRoom", {
        source: user.username,
        room: newRoomName,
        access: 0,
      });
    } else alert("You are currently in this channel");
    setNewRoomName("");
  }

  const {
    data: roomsList,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetRoomsListQuery({});

  useEffect(() => {
    refetch();
  }, [refetch]);

  if (isError) return <Error error={error} />;
  else if (isLoading)
    return (
      <div>
        <Skeleton variant="text" />
        <Skeleton variant="rectangular" />
      </div>
    );

  return (
    <div className="joinChannel">
      <p>Join a new channel</p>
      <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
        <InputLabel>Channel</InputLabel>
        <Select
          name="roomsList"
          onOpen={refetch}
          onClick={refetch}
          onChange={changeSelectedRoom}
          value={newRoomName}
          defaultValue=""
        >
          {roomsList.map((room: any) => {
            if (
              !rooms.room.find(
                (obj: { name: string; role: userRole; hasPassword: boolean }) =>
                  obj.name === room.roomName,
              ) &&
              room.access !== accessStatus.private
            )
              return (
                <MenuItem
                  key={room.roomName}
                  value={room.roomName}
                  onClick={() => setAccess(room.access)}
                >
                  <Grid container>
                    <Grid item xs={10}>
                      {room.roomName}
                    </Grid>
                    {room.hasPassword === false ? (
                      <VisibilityIcon />
                    ) : (
                      <LockIcon />
                    )}
                  </Grid>
                </MenuItem>
              );
            else return null;
          })}
        </Select>
        <FormHelperText>Select an existing channel</FormHelperText>
      </FormControl>
      <IconButton size="small" onClick={joinRoom}>
        <AddIcon />
      </IconButton>
      {showDialog === true ? (
        <PasswordDialog
          open={showDialog}
          setOpen={setShowDialog}
          roomName={newRoomName}
          role={userRole.none}
          createRoom={true}
        />
      ) : null}
    </div>
  );
}

export default JoinChannel;
