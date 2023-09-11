import { Avatar, Box, Button, Grid, Typography } from "@mui/material";
import { HideSource, Delete } from "@mui/icons-material";
import webSocketManager from "../../webSocket";
import {useSelector} from "react-redux";
import { useState } from "react";

function OfflineStatus({username, refetch}: {username: string, refetch: any}) {
  const urlAvatar = `http://${process.env.REACT_APP_IP}:5000/api/avatar/${username}`;
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const user = useSelector((state: any) => state.user);

  return (
    <Grid
      item
      xs
      sx={{ backgroundColor: "", width: "100%", height: "90%" }}
    >
      <Box
        sx={{
          backgroundColor: "#919191",
          marginTop: "0.5em",
          borderRadius: "0.5em",
          padding: "0.1em",
          paddingX: "0.4em",
        }}
      >
        <Grid
          container
          direction="row"
          spacing={1}
          alignItems="center"
          sx={{ flexWrap: "nowrap" }}
          justifyContent="space-between"
        >
          <Grid
            container
            item
            alignItems="center"
            spacing={1}
          >
            <Grid item>
              <Avatar
                src={urlAvatar}
                alt="User Avatar"
                sx={{
                  width: "2em",
                  height: "2em",
                  border: "black solid",
                  borderWidth: "1px",
                  borderRadius: "3em",
                  marginLeft: "0.3em",
                  marginRight: "0.3em",
                }}
              />
            </Grid>

            <Grid item>
              <Typography
                variant="h6"
                align="left"
                sx={{
                  fontSize: 16,
                  fontWeight: "bold",
                  color: "black",
                  transform: "translate(0%, 10%)",
                }}
              >
                {username}
              </Typography>
              <Typography
                variant="h6"
                align="left"
                sx={{
                  fontSize: 14,
                  color: "black",
                  transform: "translate(0%, -4%)",
                }}
              >
                <HideSource
                  sx={{
                    fontSize: "15px",
                    transform: "translate(0%, 16%)",
                    marginRight: "4px" }}
                />
                Offline
              </Typography>
            </Grid>
          </Grid>

          <Grid item>
            <Button
              onClick={() => {
                webSocketManager.getSocket()?.emit("removeFriend", {
                  source: user.username,
                  target: username,
                });
              }}
              sx={{
                backgroundColor: "#D9D9D9",
                border: "black solid",
                borderRadius: "10px",
                borderWidth: "1px",
                width: "30px",
                height: "30px",
                minWidth: "5px",
                marginRight: "0.3em",
              }}
            >
              <Delete sx={{ fontSize: 20 }} />
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Grid>
  );
}

export default OfflineStatus;
