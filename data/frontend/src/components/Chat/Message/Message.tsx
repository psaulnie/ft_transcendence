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

  return (
    <div className="message">
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
                  fontWeight: "bold",
                  overflowWrap: "break-word",
                  wordBreak: "break-word",
                  textAlign: user.username !== message.source ? "start" : "end",
                }}
              >
                {message.source}
              </Typography>
              <Typography
                style={{
                  color: "black",
                  overflowWrap: "break-word",
                  wordBreak: "break-word",
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
