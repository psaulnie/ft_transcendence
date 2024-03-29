import React, {useEffect, useState} from "react";

import {useDispatch, useSelector} from "react-redux";
import {useLazyGetBlockedUsersQuery, useLazyGetUserRoomListQuery} from "../../store/api";
import {addBlockedUser} from "../../store/user";

import Room from "./Room";
import Tab from "./Tab";
import UsersTab from "./UsersTab";
import DirectMessageProvider from "./DirectMessageProvider";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChatProcess from "./ChatProcess";

import {Box, Button, Grid, Slide} from "@mui/material";

import RoomTabs from "./RoomTabs";
import {addRoom, setRoomIndex} from "../../store/rooms";
import ErrorSnackbar from "../Global/ErrorSnackbar";
import Loading from "../Global/Loading";
import webSocketManager from "../../webSocket";

function Chat() {
  const user = useSelector((state: any) => state.user);
  const rooms = useSelector((state: any) => state.rooms);
  const dispatch = useDispatch();

  const [isOpen, setIsOpen] = useState(false);

  const toggleBox = () => {
    setIsOpen(!isOpen);
  };

  const [fetchUserRoomList, userRoomList] = useLazyGetUserRoomListQuery();
  const [fetchBlockedUsers, blockedUsers] = useLazyGetBlockedUsersQuery();

  useEffect(() => {
    if (blockedUsers.status === "uninitialized") {
      fetchBlockedUsers({});
    }

    if (blockedUsers.isSuccess && blockedUsers.data) {
      blockedUsers.data.forEach((element: any) => {
        dispatch(addBlockedUser(element));
      });
    }

    if (userRoomList.status === "uninitialized") {
      fetchUserRoomList({});
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
            username: user.username,
            listener: element.roomName,
          })
        );
      });

      if (userRoomList.data.length > 0) {
        dispatch(setRoomIndex(0));
      }
    }
  }, [
    blockedUsers,
    userRoomList,
    user.username,
    dispatch,
    fetchBlockedUsers,
    fetchUserRoomList,
  ]);

  if (blockedUsers.isError) return <ErrorSnackbar error={blockedUsers.error}/>;
  else if (userRoomList.isError)
    return <ErrorSnackbar error={userRoomList.error}/>;
  else if (blockedUsers.isLoading || userRoomList.isLoading) return <Loading/>;

  return (
    <div className="chat">
      <ChatProcess/>
      <DirectMessageProvider/>
      <div style={{display: "flex", alignItems: "flex-start"}}>
        <Button
          onClick={toggleBox}
          sx={{
            position: "fixed",
            bottom: isOpen ? "34.8em" : "0em",
            right: 0,
            width: "36em",
            backgroundColor: "#ff8700",
            "&:hover": {
              backgroundColor: "#ffab4c",
            },
            "@media (max-width: 600px) or (max-height: 700px)": {
              width: "22.82em",
              bottom: isOpen ? "34.8em" : "0em",
            },
          }}
        >
          {isOpen ? <ExpandMoreIcon/> : <ExpandLessIcon/>}
        </Button>
        <Slide direction="up" in={isOpen}>
          <Box
            sx={{
              position: "fixed",
              bgcolor: "#FE8F29",
              height: "30.28em",
              width: "31.5em",
              borderRadius: "2%",
              opacity: 0.9,
              boxShadow: "0 0 10px rgba(0, 0, 0, 0.3)",
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
            <Grid container sx={{height: "5%", width: "100%"}}>
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
                {rooms.index !== -1 && rooms.room[rooms.index] ? (
                  <UsersTab roomName={rooms.room[rooms.index].name}/>
                ) : null}
              </Grid>
              <Grid item zIndex={99} xs={9} sx={{height: "5%", width: "20%"}}>
                <RoomTabs/>
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
                <Tab/>
              </Grid>
            </Grid>
            <Grid
              zIndex={0}
              sx={{
                height: "95%",
                width: "100%",
                overflow: "hidden",
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
