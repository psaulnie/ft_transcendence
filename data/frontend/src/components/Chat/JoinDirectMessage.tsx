import React, {useEffect, useState} from "react";

import webSocketManager from "../../webSocket";
import {useDispatch, useSelector} from "react-redux";
import {useGetUsersListQuery} from "../../store/api";
import {addRoom} from "../../store/rooms";
import {
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import {userRole} from "./chatEnums";
import ErrorSnackbar from "../Global/ErrorSnackbar";
import Loading from "../Global/Loading";

function JoinDirectMessage() {
  const user = useSelector((state: any) => state.user);
  const rooms = useSelector((state: any) => state.rooms);
  const dispatch = useDispatch();

  const [newUser, setNewUser] = useState("");

  function changeSelectedUser(event: SelectChangeEvent) {
    event.preventDefault();
    setNewUser(event.target.value);
  }

  function joinRoom(event: any) {
    event.preventDefault();
    if (newUser === "") return;
    if (
      !rooms.room.find(
        (obj: { name: string; role: string }) => obj.name === newUser,
      )
    ) {
      const roomName = user.username > newUser ? user.username + newUser : newUser + user.username;
      dispatch(
        addRoom({
          name: roomName,
          role: userRole.none,
          isDirectMsg: true,
          hasPassword: false,
          openTab: true,
          isMuted: false,
          username: user.username,
        }),
      );
      webSocketManager.getSocket().emit("openPrivateMsg", {
        source: user.username,
        room: newUser,
        access: 0,
      });
    }
    setNewUser("");
  }

  const {
    data: usersList,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetUsersListQuery({});

  useEffect(() => {
    refetch();
  }, [refetch]);

  if (isError) return <ErrorSnackbar error={error}/>;
  else if (isLoading) return <Loading/>;

  return (
    <Grid className="joinDirectMessage">
      <Typography sx={{marginTop: "2em"}}>Direct Message</Typography>
      <FormControl sx={{minWidth: 120}} size="small">
        <InputLabel>Users</InputLabel>
        <Select
          name="usersList"
          onClick={refetch}
          onChange={changeSelectedUser}
          value={newUser}
          defaultValue=""
        >
          {usersList.map((username: any, key: number) => {
            if (
              !user.blockedUsers.find((obj: string) => obj === username) &&
              user.username !== username
            )
              return (
                <MenuItem key={key} value={username}>
                  {username}
                </MenuItem>
              );
            else return null;
          })}
        </Select>
        <FormHelperText>Select an user</FormHelperText>
      </FormControl>
      <IconButton
        size="small"
        onClick={joinRoom}
        disabled={newUser === ""}
        sx={{transform: "translate(0%, 6%)"}}
      >
        <AddIcon/>
      </IconButton>
    </Grid>
  );
}

export default JoinDirectMessage;
