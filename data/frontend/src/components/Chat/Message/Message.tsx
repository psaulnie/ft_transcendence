import { chatResponseArgs } from "../args.interface";

import { useState } from "react";
import { useSelector } from "react-redux";

import UserOptionsMenu from "./UserOptionsMenu";

import {
  useGetUserStatusInRoomQuery,
  useLazyGetUserFriendsListQuery,
} from "../../../store/api";

import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import CustomAvatar from "../../Global/CustomAvatar";
import { userRole } from "../chatEnums";

const StyledPaper = styled(Paper)(({ theme }) => ({
  backgroundColor: "#102b47",
  ...theme.typography.body2,
  padding: theme.spacing(2),
  maxWidth: 400,
}));

type arg = {
  message: chatResponseArgs;
  role: userRole;
  roomName: string;
  isDirectMessage: boolean;
};

export default function Message({
  message,
  role,
  roomName,
  isDirectMessage,
}: arg) {
  const user = useSelector((state: any) => state.user);
  const [contextMenu, setContextMenu] = useState<{
    mouseX: number;
    mouseY: number;
  } | null>(null);
  const [showAdminOpt, setShowAdminOpt] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const {
    data: cUser,
    isSuccess,
    refetch,
  } = useGetUserStatusInRoomQuery(
    { roomName: roomName },
    { skip: isDirectMessage }
  );

  const [trigger, result] = useLazyGetUserFriendsListQuery();

  const handleContextMenu = (event: React.MouseEvent) => {
    event.preventDefault();
    trigger({});
    if (!isDirectMessage) {
      refetch();
      if (isSuccess) {
        setShowAdminOpt(true);
        setIsMuted(cUser.isMuted);
      } else setShowAdminOpt(false);
    } else setShowAdminOpt(false);
    setContextMenu(
      contextMenu === null
        ? {
            mouseX: event.clientX + 2,
            mouseY: event.clientY - 6,
          }
        : null
    );
  };

  return (
    <div className="message" onContextMenu={handleContextMenu}>
      {user.username !== message.source ? (
        <UserOptionsMenu
          cUser={{
            username: message.source,
            role: message.role,
            isMuted: isMuted,
          }}
          role={role}
          roomName={roomName}
          contextMenu={contextMenu}
          setContextMenu={setContextMenu}
          showAdminOpt={showAdminOpt}
          friendList={result}
        />
      ) : null}
      <Box sx={{ flexGrow: 1, overflow: "hidden", px: 3, opacity: 1 }}>
        <StyledPaper
          sx={{
            my: 1,
            mx: "auto",
            p: 2,
            bgcolor: "#ffd089",
          }}
        >
          <Grid container wrap="nowrap" spacing={2}>
            {user.username !== message.source ? (
              <Grid item>
                <CustomAvatar username={message.source} />
              </Grid>
            ) : null}
            <Grid item xs style={{ flexWrap: "wrap" }}>
              <Typography
                style={{
                  color: "black",
                  overflowWrap: "break-word",
                  textAlign: user.username !== message.source ? "start" : "end",
                }}
              >
                {message.data}
              </Typography>
            </Grid>
            {user.username === message.source ? (
              <Grid item>
                <CustomAvatar username={message.source} />
              </Grid>
            ) : null}
          </Grid>
        </StyledPaper>
      </Box>
    </div>
  );
}
