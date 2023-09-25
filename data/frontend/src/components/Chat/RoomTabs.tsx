import { Tabs, Tab, IconButton } from "@mui/material";

import MessageProvider from "./Message/MessageProvider";

import CloseIcon from "@mui/icons-material/Close";
import MarkChatUnreadIcon from "@mui/icons-material/MarkChatUnread";
import ChatBubbleIcon from "@mui/icons-material/ChatBubble";

import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";

import webSocketManager from "../../webSocket";
import { removeRoom, setRead, setRoomIndex } from "../../store/rooms";
import RoomOptionsMenu from "./RoomOptionsMenu";

export default function RoomTabs() {
  const user = useSelector((state: any) => state.user);
  const rooms = useSelector((state: any) => state.rooms);
  const dispatch = useDispatch();
  const [contextMenu, setContextMenu] = useState<{
    mouseX: number;
    mouseY: number;
  } | null>(null);

  const handleContextMenu = (event: React.MouseEvent, key: number) => {
    event.preventDefault();
    if (rooms.index === key)
      setContextMenu(
        contextMenu === null
          ? {
              mouseX: event.clientX + 2,
              mouseY: event.clientY - 6,
            }
          : null,
      );
  };
  function changeSelectedRoom(event: React.SyntheticEvent, newIndex: number) {
    dispatch(setRoomIndex(newIndex));
    dispatch(setRead(newIndex));
  }

  function quitRoom(roomName: string) {
    webSocketManager.getSocket().emit("leaveRoom", {
      source: user.username,
      room: roomName,
      access: 0,
    });
    dispatch(removeRoom(roomName));
  }

  if (rooms.index !== -1)
    return (
      <Tabs
        sx={{
          position: "fixed",
          bottom: "100",
          "& .MuiTabs-flexContainer": {
            maxWidth: "19em",
            maxHeight: "80%",
            marginTop: "0px",
          },
          "@media (max-width: 600px) or (max-height: 700px)": {
            "& .MuiTabs-flexContainer": {
              maxWidth: "10em",
              maxHeight: "80%",
              marginTop: "0px",
            },
          },
          "& .MuiTab-root": {
            fontSize: "10px",
            padding: "6px",
            minHeight: "4em",
            minWidth: "1em",
          },
          "& .MuiTabs-indicator": {
            top: "0",
            marginTop: "2px",
            backgroundColor: "transparent",
          },
          "& .MuiTabs-scrollButtons.Mui-disabled": {
            opacity: "0.3",
          },
          "& .Mui-selected": {
            backgroundColor: "#FC7D07",
            color: "black",
          },
        }}
        value={rooms.index}
        onChange={changeSelectedRoom}
        variant="scrollable"
        scrollButtons="auto"
        allowScrollButtonsMobile
      >
        {rooms.room.map(
          (
            room: { name: string; role: number; unread: boolean; listener: string },
            key: number,
          ) => (
            <Tab
              onClick={() => dispatch(setRead(key))}
              value={key}
              tabIndex={key}
              key={key}
              onContextMenu={(event) => handleContextMenu(event, key)}
              label={
                <span>
                  {room.name}
                  {rooms.index === key ? (
                    <IconButton
                      size="small"
                      component="span"
                      onClick={() => quitRoom(room.name)}
                    >
                      <CloseIcon />
                    </IconButton>
                  ) : null}
                  <MessageProvider roomName={room.listener} />
                  <RoomOptionsMenu
                    contextMenu={contextMenu}
                    setContextMenu={setContextMenu}
                    roomIndex={key}
                    roomName={room.name}
                    role={room.role}
                  />
                </span>
              }
              icon={
                room.unread ? (
                  <MarkChatUnreadIcon fontSize="small" />
                ) : (
                  <ChatBubbleIcon fontSize="small" />
                )
              }
              iconPosition="start"
            />
          ),
        )}
      </Tabs>
    );
  else return null;
}
