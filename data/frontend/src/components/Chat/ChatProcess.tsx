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
import webSocketManager from "../../webSocket";

import { Snackbar, Alert, AlertColor, IconButton, Box } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import { userRole } from "./chatEnums";
import { setUsername } from "../../store/user";
import { userStatus } from "../Friendlist/userStatus";
import { useLocation, useNavigate } from "react-router";

export default function ChatProcess() {
  const user = useSelector((state: any) => state.user);
  const rooms = useSelector((state: any) => state.rooms);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [open, setOpen] = useState(false);
  const [openInvite, setOpenInvite] = useState(false);
  const [openFriend, setOpenFriend] = useState(false);
  const [openPong, setOpenPong] = useState(false);
  const [message, setMessage] = useState("");
  const [type, setType] = useState<AlertColor>("success");
  const [room, setRoom] = useState("");
  const [target, setTarget] = useState("");
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

  function setFriendSnackbar(message: string, type: AlertColor) {
    setMessage(message);
    setType(type);
    setOpenFriend(true);
  }

  function setPongSnackbar(message: string, type: AlertColor) {
    setMessage(message);
    setType(type);
    setOpenPong(true);
  }

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  const handleCloseInvite = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenInvite(false);
    setOpenFriend(false);
  };

  const handleClosePong = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenInvite(false);
    setOpenFriend(false);
    setOpenPong(false);
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
      })
    );
    webSocketManager.getSocket()?.emit("joinPrivateRoom", {
      roomName: room,
      username: user.username,
    });
    setRoom("");
    setHasPassword(false);
  }

  function acceptPlayPong() {
    if (!target || target === "") return;
    setOpenPong(false);
    webSocketManager.getSocket()?.emit("acceptPlayPong", target);
  }
  function acceptBeingFriend() {
    if (target === "") return;
    setOpenFriend(false);
    webSocketManager.getSocket()?.emit("acceptBeingFriend", {
      source: user.username,
      target: target,
    });
  }

  useEffect(() => {
    function process(value: chatResponseArgs) {
      if (value.action === actionTypes.joinRoom) {
        dispatch(
          addRoom({
            name: value.target,
            role: value.role,
            isDirectMsg: false,
            hasPassword: value.hasPassword,
            openTab: true,
            isMuted: false,
          })
        );
      } else if (value.action === actionTypes.leaveRoom) { 
        dispatch(removeRoom(value.target));
      } else if (value.action === actionTypes.roomAlreadyExist) {
        setSnackbar("This room already exists: " + value.target, 'error');
      } 
      else if (value.action === actionTypes.kick) {
        dispatch(removeRoom(value.target));
        setSnackbar(
          "You've been kicked from this channel: " + value.target,
          "error"
        );
      } else if (value.action === actionTypes.ban) {
        dispatch(removeRoom(value.target));
        setSnackbar(
          "You are banned from this channel: " + value.target,
          "error"
        );
      } else if (value.action === actionTypes.unban) {
        setSnackbar('You are unbanned from this channel: ' + value.target, 'success')
      } else if (value.action === actionTypes.beenUnbanned) {
        setSnackbar(value.target + ' has been unbanned from this channel', 'success')
      } else if (value.action === actionTypes.private) {
        dispatch(removeRoom(value.target));
        setSnackbar(
          "You cannot join this private channel: " + value.target,
          "error"
        );
      } else if (value.action === actionTypes.admin) {
        dispatch(
          changeRole({
            name: value.source,
            role: userRole.admin,
            isDirectMsg: false,
            hasPassword: false,
          })
        );
        setSnackbar("You are now admin in " + value.source, "success");
      } else if (value.action === actionTypes.owner) {
        dispatch(
          changeRole({
            name: value.source,
            role: userRole.owner,
            isDirectMsg: false,
            hasPassword: false,
          })
        );
        setSnackbar("You are now the owner of " + value.source, "success");
      } else if (value.action === actionTypes.mute) {
        dispatch(mute(value.source));
        setSnackbar("You are mute from this channel: " + value.source, "error");
      } else if (value.action === actionTypes.unmute) {
        dispatch(unmute(value.source));
        setSnackbar(
          "You've been unmuted from this channel: " + value.source,
          "success"
        );
      } else if (value.action === actionTypes.wrongpassword) {
        dispatch(removeRoom(value.target));
        setSnackbar("Wrong password", "error");
      } else if (value.action === actionTypes.invited) {
        setInviteSnackbar(
          "You've been invited in this channel: " + value.source,
          "info"
        );
        if (value.hasPassword) setHasPassword(true);
        setRoom(value.source);
      } else if (value.action === actionTypes.blockedMsg) {
        setSnackbar("This user blocked you", "error");
      } else if (value.action === actionTypes.askBeingFriend) {
        setFriendSnackbar(value.source + " wants to be your friend!", "info");
        setTarget(value.source);
      } else if (value.action === actionTypes.newUsername) {
        setSnackbar(
          "Your username has been changed to " + value.newUsername,
          "success"
        );
        dispatch(setUsername(value.newUsername));
      } else if (value.action === actionTypes.newBackground) {
        setSnackbar("Background successfully changed", "success");
      } else if (value.action === actionTypes.usernameAlreadyTaken)
        setSnackbar("Username is already taken " + value.newUsername, "error");
      else if (value.action === actionTypes.acceptBeingFriend) {
        setSnackbar(value.source + " is now your friend!", "success");
      } else if (value.action === actionTypes.cantPlay) {
        if (value.data === userStatus.offline)
          setSnackbar(
            "You can't play with " + value.target + " because he is offline",
            "error"
          );
        else if (value.data === userStatus.playing)
          setSnackbar(
            "You can't play with " +
              value.target +
              " because one of you is playing",
            "error"
          );
      } else if (value.action === actionTypes.askPlay) {
        setPongSnackbar(value.source + " wants to play with you!", "info");
        setTarget(value.source);
      } else if (value.action === actionTypes.acceptPlay) {
        if (value.source !== user.username)
          setSnackbar(value.source + " accepted to play with you!", "success");
        navigate("/game/play", {
          state: {
            players: {
              1: value.source,
              2: value.target,
            },
            background: value.data.background,
            gameRoomId: value.data.gameRoomId,
          },
        });
      } else if (value.action === actionTypes.cancelMatchmaking) {
        console.log(location.pathname);
        setSnackbar(
          "Matchmaking cancelled",
          "info"
        );
        if (location.pathname.startsWith("/game"))
          navigate('/home');
      }
    }

    function handleWsException(value: any) {
      console.log(value);
      if (value?.message === 'Already in Matchmaking' || value?.message === 'Already playing')
        navigate('/home');
      setSnackbar(value?.message, "error");
    }
  
    webSocketManager.getSocket().on("exception", handleWsException);
    webSocketManager.getSocket().on(webSocketManager.getSocket().id, process);
    return () => {
      webSocketManager
        .getSocket()
        .off(webSocketManager.getSocket().id, process);
      webSocketManager
        .getSocket()
        .off("exception", handleWsException);
    };
  }, [user.username, dispatch, rooms]);

  return (
    <div>
      <Snackbar // Default snackbar
        open={open}
        autoHideDuration={5000}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        onClose={handleClose}
      >
        <Alert onClose={handleClose} severity={type} sx={{ width: "100%" }}>
          {message}
        </Alert>
      </Snackbar>
      <Snackbar // Invite snackbar
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
      <Snackbar // Friend snackbar
        open={openFriend}
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
            onClick={acceptBeingFriend}
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
      <Snackbar // Pong snackbar
        open={openPong}
        autoHideDuration={10000}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        onClose={handleClosePong}
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
            onClick={acceptPlayPong}
          >
            <CheckIcon />
          </IconButton>
          <IconButton
            size="small"
            sx={{ color: "#000" }}
            onClick={handleClosePong}
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </Snackbar>
    </div>
  );
}
