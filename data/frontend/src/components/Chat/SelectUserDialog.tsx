import React, {useEffect, useState} from "react";
import webSocketManager from "../../webSocket";
import {Autocomplete, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Zoom,} from "@mui/material";
import {TransitionProps} from "@mui/material/transitions";

import {useSelector} from "react-redux";

import {useGetInvitedUsersListQuery} from "../../store/api";
import ErrorSnackbar from "../Global/ErrorSnackbar";
import Loading from "../Global/Loading";

type arg = {
  open: boolean;
  setOpen: any;
  roomName: string;
};

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) {
  return <Zoom ref={ref} {...props} style={{transitionDelay: "100ms"}}>{props.children}</Zoom>;
});

export default function SelectUserDialog({open, setOpen, roomName}: arg) {
  const user = useSelector((state: any) => state.user);
  const [selectedUser, setSelectedUser] = useState("");

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.repeat) return;
      const {key} = event;

      if (key === "Enter") {
        confirmButton(event);
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  });

  function updateUser(e: any, value: any) {
    if (!value || value.label === null) setSelectedUser("");
    else setSelectedUser(value.label);
  }

  function closeUserDialog(e: any) {
    e.preventDefault();
    setOpen(false);
  }

  function confirmButton(e: any) {
    e.preventDefault();
    webSocketManager.getSocket().emit("inviteUser", {
      roomName: roomName,
      username: selectedUser,
      source: user.username,
    });
    setOpen(false);
  }

  const {
    data: usersList,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetInvitedUsersListQuery({
    username: user.username,
    roomName: roomName,
  });

  useEffect(() => {
    refetch();
  }, [refetch]);

  if (isError) return <ErrorSnackbar error={error}/>;
  if (isLoading) return <Loading/>;

  return (
    <Dialog
      open={open}
      onClose={closeUserDialog}
      TransitionComponent={Transition}
      keepMounted
    >
      <DialogTitle>Choose an user:</DialogTitle>
      <DialogContent>
        <Autocomplete
          options={usersList}
          sx={{width: 300}}
          renderInput={(params: any) => (
            <TextField autoComplete='off' {...params} label="User" value={params}/>
          )}
          value={selectedUser}
          onChange={updateUser}
          isOptionEqualToValue={(option: any, value: any) =>
            option.value === value.value
          }
          onClick={refetch}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={closeUserDialog}>Cancel</Button>
        <Button
          disabled={selectedUser === "" ? true : false}
          onClick={confirmButton}
        >
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
}
