import React, {useEffect, useState} from "react";

import webSocketManager from "../../webSocket";
import {useSelector} from "react-redux";
import {useGetRoomsListQuery} from "../../store/api";
import {accessStatus, userRole} from "./chatEnums";

import PasswordDialog from "./PasswordDialog";

import {
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import LockIcon from "@mui/icons-material/Lock";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ErrorSnackbar from "../Global/ErrorSnackbar";
import Loading from "../Global/Loading";

function JoinChannel() {
  const user = useSelector((state: any) => state.user);
  const rooms = useSelector((state: any) => state.rooms);

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

  if (isError) return <ErrorSnackbar error={error}/>;
  else if (isLoading) return <Loading/>;

  return (
    <Grid className="joinChannel">
      <Typography sx={{marginTop: "2em"}}>Join a new channel</Typography>
      <FormControl sx={{minWidth: 120}} size="small">
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
                      <VisibilityIcon/>
                    ) : (
                      <LockIcon/>
                    )}
                  </Grid>
                </MenuItem>
              );
            else return null;
          })}
        </Select>
        <FormHelperText>Select an existing channel</FormHelperText>
      </FormControl>
      <IconButton
        size="small"
        onClick={joinRoom}
        sx={{transform: "translate(0%, 6%)"}}
      >
        <AddIcon/>
      </IconButton>
      {showDialog ? (
        <PasswordDialog
          open={showDialog}
          setOpen={setShowDialog}
          roomName={newRoomName}
          setNewRoomName={setNewRoomName}
          role={userRole.none}
          createRoom={true}
        />
      ) : null}
    </Grid>
  );
}

export default JoinChannel;
