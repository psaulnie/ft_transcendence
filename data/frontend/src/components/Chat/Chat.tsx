import React, { useEffect, useState } from "react";

import { webSocket } from "../../webSocket";

import { useDispatch, useSelector } from "react-redux";
import { useLazyGetBlockedUsersQuery } from "../../store/api";
import { useLazyGetUserRoomListQuery } from "../../store/api";
import { addBlockedUser } from "../../store/user";

import Room from "./Room";
import Tab from "./Tab";
import UsersTab from "./UsersTab";
import DirectMessageProvider from "./DirectMessageProvider";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChatProcess from "./ChatProcess";
import Error from "../Global/Error";

import {
  Skeleton,
  Box,
  Grid,
  Button,
  Typography,
  Avatar,
  Slide,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

import RoomTabs from "./RoomTabs";
import { addRoom, setRoomIndex } from "../../store/rooms";

function Chat() {
  const user = useSelector((state: any) => state.user);
  const rooms = useSelector((state: any) => state.rooms);
  const dispatch = useDispatch();

  const [isOpen, setIsOpen] = useState(true);

  const toggleBox = () => {
    setIsOpen(!isOpen);
  };

  const [fetchUserRoomList, userRoomList] = useLazyGetUserRoomListQuery();
  const [fetchBlockedUsers, blockedUsers] = useLazyGetBlockedUsersQuery();

  useEffect(() => {
    if (!user.isLoggedIn) {
      return;
    }

    if (blockedUsers.status === "uninitialized") {
      fetchBlockedUsers({ username: user.username });
    }

    if (blockedUsers.isSuccess && blockedUsers.data) {
      blockedUsers.data.forEach((element: any) => {
        dispatch(addBlockedUser(element));
      });
    }

    if (userRoomList.status === "uninitialized") {
      fetchUserRoomList({ username: user.username });
    }

    if (userRoomList.isSuccess && userRoomList.data) {
      userRoomList.data.forEach((element: any) => {
        dispatch(
          addRoom({
            name: element.roomName,
            role: element.role,
            hasPassword: element.hasPassword,
            isDirectMsg: false,
            isMuted: element.isMuted,
            openTab: false,
          }),
        );
      });

      if (userRoomList.data.length > 0) {
        dispatch(setRoomIndex(0));
      }
    }
  }, [
    blockedUsers,
    userRoomList,
    user.isLoggedIn,
    user.username,
    dispatch,
    fetchBlockedUsers,
    fetchUserRoomList,
  ]);

  if (!webSocket.connected) return <p>Chat Socket error</p>;
  if (blockedUsers.isError) return <Error error={blockedUsers.error} />;
  else if (userRoomList.isError) return <Error error={userRoomList.error} />;
  else if (blockedUsers.isLoading || userRoomList.isLoading)
    return (
      <div>
        <Skeleton variant="text" />
        <Skeleton variant="rectangular" />
      </div>
    );

  return (
    <div className="chat">
      <ChatProcess />

      <div style={{ display: "flex", alignItems: "flex-start" }}>
        <Button
          onClick={toggleBox}
          sx={{
            position: "fixed",
            bottom: isOpen ? "35.9em" : "0em",

            right: 0,
            width: "35.55em",
            backgroundColor: "#ff8700",
            "&:hover": {
              backgroundColor: "#ffab4c",
              borderColor: "red",
            },
            "@media (max-width: 600px) or (max-height: 700px)": {
              width: "22.82em",
              bottom: isOpen ? "34.55em" : "0em",
            },
          }}
        >
          {isOpen ? <ExpandMoreIcon /> : <ExpandLessIcon />}
        </Button>
        <Slide direction="up" in={isOpen}>
          <Box
            sx={{
              position: "fixed",
              bgcolor: "#FE8F29",
              height: "30.28em",
              width: "31.28em",
              borderRadius: "2%",
              opacity: 0.8,
              border: 8,
              borderColor: "#FC7D07",
              marginTop: "auto",
              bottom: 0,
              right: 0,
              zIndex: 9,
              "@media (max-width: 600px) or (max-height: 700px)": {
                width: "20em",
                height: "30.28em",
              },
            }}
          >
            <Grid container sx={{ height: "5%", width: "100%" }}>
              <DirectMessageProvider />
              <Grid
                item
                xs={1}
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  alignItems: "right",
                  marginLeft: "0.4em",
                  "@media (max-width: 600px) or (max-height: 700px)": {
                    marginLeft: "0.2em",
                  },
                }}
              >
                {rooms.index !== -1 && rooms.room[rooms.index] ? ( // CONDITION'S HERE TO KNOW IF THE USER IS NOT IN A ROOM
                  <UsersTab roomName={rooms.room[rooms.index].name} />
                ) : null}
              </Grid>
              <Grid item zIndex={99} xs={9} sx={{ height: "5%", width: "20%" }}>
                <RoomTabs />
              </Grid>
              <Grid
                item
                xs={1}
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  alignItems: "right",
                  marginLeft: "1.1em",
                }}
              >
                <Tab />
              </Grid>
            </Grid>
            <Grid
              zIndex={0}
              sx={{
                height: "95%",
                width: "100%",
                overflow: "scroll",
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-end",
              }}
            >
              {rooms.index !== -1 && rooms.room[rooms.index] ? (
                <Room
                  key={rooms.room[rooms.index].name}
                  roomName={rooms.room[rooms.index].name}
                />
              ) : null}
            </Grid>
          </Box>
        </Slide>
      </div>
    </div>
  );
}

export default Chat;
