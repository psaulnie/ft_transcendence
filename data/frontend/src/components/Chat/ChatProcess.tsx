import { useEffect, useState } from "react";
import { actionTypes } from "./args.types";

import { useDispatch, useSelector } from "react-redux";
import {
  removeRoom,
  changeRole,
  addRoom,
  mute,
  unmute,
} from "../../store/rooms";

import { chatResponseArgs } from "./args.interface";
import { webSocket } from "../../webSocket";

import { Snackbar, Alert, AlertColor, IconButton, Box } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import { userRole } from "./chatEnums";

export default function ChatProcess() {
  const user = useSelector((state: any) => state.user);
  const rooms = useSelector((state: any) => state.rooms);
  const dispatch = useDispatch();

  const [open, setOpen] = useState(false);
  const [openInvite, setOpenInvite] = useState(false);
  const [message, setMessage] = useState("");
  const [type, setType] = useState<AlertColor>("success");
  const [room, setRoom] = useState("");
  const [hasPassword, setHasPassword] = useState(false);

  function setSnackbar(message: string, type: AlertColor) {
    setMessage(message);
    setType(type);
    setOpen(true);
  }

  function setInviteSnackbar(message: string, type: AlertColor) {
    setMessage(message);
    setType(type);
    setOpenInvite(true);
  }

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string,
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  const handleCloseInvite = (
    event?: React.SyntheticEvent | Event,
    reason?: string,
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenInvite(false);
  };

  function acceptInvite() {
    if (room === "") return;
    setOpenInvite(false);
    dispatch(
      addRoom({
        name: room,
        role: userRole.none,
        isDirectMsg: false,
        hasPassword: hasPassword,
        openTab: true,
        isMuted: false,
      }),
    );
    webSocket.emit("joinPrivateRoom", {
      roomName: room,
      username: user.username,
    });
    setRoom("");
    setHasPassword(false);
  }

  useEffect(() => {
    function process(value: chatResponseArgs) {
      if (value.action === actionTypes.kick) {
        dispatch(removeRoom(value.target));
        setSnackbar(
          "You've been kicked from this channel: " + value.target,
          "error",
        );
      } else if (value.action === actionTypes.ban) {
        dispatch(removeRoom(value.target));
        setSnackbar(
          "You are banned from this channel: " + value.target,
          "error",
        );
      } else if (value.action === actionTypes.private) {
        dispatch(removeRoom(value.target));
        setSnackbar(
          "You cannot join this private channel: " + value.target,
          "error",
        );
      } else if (value.action === actionTypes.admin) {
        dispatch(
          changeRole({
            name: value.source,
            role: userRole.admin,
            isDirectMsg: false,
            hasPassword: false,
          }),
        );
        setSnackbar("You are now admin in " + value.source, "success");
      } else if (value.action === actionTypes.mute) {
        dispatch(mute(value.source));
        setSnackbar("You are mute from this channel: " + value.source, "error");
      } else if (value.action === actionTypes.unmute) {
        dispatch(unmute(value.source));
        setSnackbar(
          "You've been unmuted from this channel: " + value.source,
          "success",
        );
      } else if (value.action === actionTypes.wrongpassword) {
        dispatch(removeRoom(value.target));
        setSnackbar("Wrong password", "error");
      } else if (value.action === actionTypes.invited) {
        setInviteSnackbar(
          "You've been invited in this channel: " + value.source,
          "info",
        );
        if (value.hasPassword) setHasPassword(true);
        setRoom(value.source);
      } else if (value.action === actionTypes.blockedMsg) {
        setSnackbar("This user blocked you", "error");
      }
    }
    webSocket.on(user.username + "OPTIONS", process);
    return () => {
      webSocket.off(user.username + "OPTIONS", process);
    };
  }, [user.username, dispatch, rooms]);

  return (
    <div>
      <Snackbar
        open={open}
        autoHideDuration={5000}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        onClose={handleClose}
      >
        <Alert onClose={handleClose} severity={type} sx={{ width: "100%" }}>
          {message}
        </Alert>
      </Snackbar>
      <Snackbar
        open={openInvite}
        autoHideDuration={10000}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        onClose={handleCloseInvite}
      >
        <Box
          sx={{
            backgroundColor: "#fff",
            color: "#000",
            borderRadius: "10px",
            width: "100%",
            display: "flex",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <PeopleAltIcon sx={{ color: "#000" }} />
          {message}
          <IconButton
            size="small"
            sx={{ color: "#000" }}
            onClick={acceptInvite}
          >
            <CheckIcon />
          </IconButton>
          <IconButton
            size="small"
            sx={{ color: "#000" }}
            onClick={handleCloseInvite}
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </Snackbar>
    </div>
  );
}
