import React, { useEffect, useState } from "react";
import { actionTypes } from "./args.types";

import { useDispatch, useSelector } from "react-redux";
import {
  addRoom,
  changeRole,
  mute,
  removeRoom,
  unmute,
} from "../../store/rooms";

import { chatResponseArgs } from "./args.interface";
import webSocketManager from "../../webSocket";

import {
  Button,
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import { userRole } from "./chatEnums";
import { setUsername } from "../../store/user";
import { userStatus } from "../Friendlist/userStatus";
import { useNavigate } from "react-router";
import { closeSnackbar, enqueueSnackbar } from "notistack";

export default function ChatProcess() {
  const user = useSelector((state: any) => state.user);
  const rooms = useSelector((state: any) => state.rooms);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [hasPassword, setHasPassword] = useState(false);


  const handleClose = (snackbarId?: any) => {
    closeSnackbar(snackbarId);
  };

  const handleCloseInvite = (snackbarId?: any) => {
    closeSnackbar(snackbarId);
  };

  const handleCloseFriend = (snackbarId?: any) => {
    closeSnackbar(snackbarId);
  };

  const handleClosePong = (snackbarId: any) => {
    closeSnackbar(snackbarId);
  };

  function acceptInvite(snackbarId: string) {
    closeSnackbar(snackbarId);
    const room = snackbarId.split("-", 1)[0];
    if (!room || room === "") return;
    dispatch(
      addRoom({
        name: room,
        role: userRole.none,
        isDirectMsg: false,
        hasPassword: hasPassword,
        openTab: true,
        isMuted: false,
        username: user.username,
        listener: room,
      })
    );
    webSocketManager.getSocket()?.emit("joinPrivateRoom", {
      roomName: room,
      username: user.username,
    });
    setHasPassword(false);
  }

  function acceptPlayPong(snackbarId: any) {
    closeSnackbar(snackbarId);
    const target = snackbarId.split("-", 1)[0];
    if (!target || target === "") return;
    webSocketManager.getSocket()?.emit("acceptPlayPong", target);
  }

  function acceptBeingFriend(snackbarId: any) {
    closeSnackbar(snackbarId);
    const target = snackbarId.split("-", 1)[0];
    if (!target || target === "") return;
    webSocketManager.getSocket()?.emit("acceptBeingFriend", {
      source: user.username,
      target: target,
    });
  }

  const actionInvite = (snackbarId: any) => (
    <>
      <Button
        onClick={() => acceptInvite(snackbarId)}
        color="inherit"
        size="small"
      >
        <CheckIcon />
      </Button>
      <Button
        onClick={() => handleCloseInvite(snackbarId)}
        color="inherit"
        size="small"
      >
        <CloseIcon />
      </Button>
    </>
  );

  const actionFriend = (snackbarId: any) => (
    <>
      <Button
        onClick={() => acceptBeingFriend(snackbarId)}
        color="inherit"
        size="small"
      >
        <CheckIcon />
      </Button>
      <Button
        onClick={() => handleCloseFriend(snackbarId)}
        color="inherit"
        size="small"
      >
        <CloseIcon />
      </Button>
    </>
  );

  const actionPong = (snackbarId: any) => (
    <>
      <Button
        onClick={() => acceptPlayPong(snackbarId)}
        color="inherit"
        size="small"
      >
        <CheckIcon />
      </Button>
      <Button
        onClick={() => handleClosePong(snackbarId)}
        color="inherit"
        size="small"
      >
        <CloseIcon />
      </Button>
    </>
  );

  const action = (snackbarId: any) => (
    <Button
      onClick={() => handleClose(snackbarId)}
      color="inherit"
      size="small"
    >
      <CloseIcon />
    </Button>
  );

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
            username: user.username,
            listener: value.target,
          })
        );
      } else if (value.action === actionTypes.roomAlreadyExist) {
        enqueueSnackbar("This room already exists: " + value.target, {
          variant: "error",
          action,
        });
      } else if (value.action === actionTypes.kick) {
        dispatch(removeRoom(value.target));
        enqueueSnackbar(
          "You've been kicked from this channel: " + value.target,
          { variant: "error", action,
        }
        );
      } else if (value.action === actionTypes.ban) {
        dispatch(removeRoom(value.target));
        enqueueSnackbar("You are banned from this channel: " + value.target, {
          variant: "error", action,
        });
      } else if (value.action === actionTypes.unban) {
        enqueueSnackbar("You are unbanned from this channel: " + value.target, {
          variant: "success", action,
        });
      } else if (value.action === actionTypes.beenUnbanned) {
        enqueueSnackbar(value.target + " has been unbanned from this channel", {
          variant: "success", action,
        });
      } else if (value.action === actionTypes.private) {
        dispatch(removeRoom(value.target));
        enqueueSnackbar(
          "You cannot join this private channel: " + value.target,
          { variant: "error", action, }
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
        enqueueSnackbar("You are now admin in " + value.source, {
          variant: "success", action,
        });
      } else if (value.action === actionTypes.owner) {
        dispatch(
          changeRole({
            name: value.source,
            role: userRole.owner,
            isDirectMsg: false,
            hasPassword: false,
          })
        );
        enqueueSnackbar("You are now the owner of " + value.source, {
          variant: "success", action,
        });
      } else if (value.action === actionTypes.mute) {
        dispatch(mute(value.source));
        enqueueSnackbar("You are mute from this channel: " + value.source, {
          variant: "error", action,
        });
      } else if (value.action === actionTypes.unmute) {
        dispatch(unmute(value.source));
        enqueueSnackbar(
          "You've been unmuted from this channel: " + value.source,
          { variant: "success", action, }
        );
      } else if (value.action === actionTypes.wrongpassword) {
        dispatch(removeRoom(value.target));
        enqueueSnackbar("Wrong password", { variant: "error", action, });
      } else if (value.action === actionTypes.invited) {
        if (value.hasPassword) setHasPassword(true);
        enqueueSnackbar(
          "You've been invited in this channel: " + value.source,
          {
            action: actionInvite,
            variant: "info",
            key:
              value.source +
              "-" +
              (Math.random() + 1).toString(36).substring(7),
          }
        );
      } else if (value.action === actionTypes.blockedMsg) {
        enqueueSnackbar("This user blocked you", { variant: "error", action, });
      } else if (value.action === actionTypes.askBeingFriend) {
        enqueueSnackbar(value.source + " wants to be your friend!", {
          action: actionFriend,
          variant: "info",
          key:
            value.source + "-" + (Math.random() + 1).toString(36).substring(7),
        });
      } else if (value.action === actionTypes.newUsername) {
        enqueueSnackbar(
          "Your username has been changed to " + value.newUsername,
          { variant: "success", action, }
        );
        dispatch(setUsername(value.newUsername));
      } else if (value.action === actionTypes.newBackground) {
        enqueueSnackbar("Background successfully changed", {
          variant: "success", action,
        });
      } else if (value.action === actionTypes.usernameAlreadyTaken)
        enqueueSnackbar("Username is already taken " + value.newUsername, {
          variant: "error", action,
        });
      else if (value.action === actionTypes.acceptBeingFriend) {
        enqueueSnackbar(value.source + " is now your friend!", {
          variant: "success", action,
        });
      } else if (value.action === actionTypes.cantPlay) {
        if (value.data === userStatus.offline)
          enqueueSnackbar(
            "You can't play with " + value.target + " because he is offline",
            { variant: "error", action, }
          );
        else if (value.data === userStatus.playing)
          enqueueSnackbar(
            "You can't play with " +
              value.target +
              " because he is already playing",
            { variant: "error", action, }
          );
      } else if (value.action === actionTypes.askPlay) {
        enqueueSnackbar(value.source + " wants to play with you!", {
          action: actionPong,
          variant: "info",
          key:
            value.source + "-" + (Math.random() + 1).toString(36).substring(7),
        });
      } else if (value.action === actionTypes.acceptPlay) {
        if (value.source !== user.username)
          enqueueSnackbar(value.source + " accepted to play with you!", {
            variant: "success", action,
          });
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
      }
    }

    function handleWsException(value: any) {
      enqueueSnackbar(value?.message, { variant: "error", action, });
    }

    webSocketManager.getSocket().on("exception", handleWsException);
    webSocketManager.getSocket().on(webSocketManager.getSocket().id, process);
    return () => {
      webSocketManager
        .getSocket()
        .off(webSocketManager.getSocket().id, process);
      webSocketManager.getSocket().off("exception", handleWsException);
    };
  }, [user.username, dispatch, rooms]);

  return (
    null
  );
}
