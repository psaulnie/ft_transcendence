import {
  Avatar,
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  Typography,
  Zoom,
} from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import React from "react";
import { useGetBanListQuery } from "../../store/api";
import Loading from "../Global/Loading";
import ErrorSnackbar from "../Global/ErrorSnackbar";
import webSocketManager from "../../webSocket";

import GavelIcon from "@mui/icons-material/Gavel";
import { useSelector } from "react-redux";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Zoom ref={ref} {...props} style={{ transitionDelay: "100ms" }} />;
});

export default function BanListDialog({
  open,
  setOpen,
  roomName,
}: {
  open: boolean;
  setOpen: any;
  roomName: string;
}) {
  const { data, isError, isLoading, error, refetch } = useGetBanListQuery({
    roomName,
  });

  if (isLoading) return <Loading />;
  if (isError) return <ErrorSnackbar error={error} />;

  function closeDialog() {
    setOpen(false);
  }

  function unban(username: string) {
    webSocketManager.getSocket()?.emit("unban", {roomName, username});
    setTimeout(() => {
      refetch();
    }, 500);
  }
  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={closeDialog}
    >
      <DialogTitle>Banned user</DialogTitle>
      <DialogContent sx={{ overflow: "auto" }}>
        <Box
          sx={{
            height: "100%",
            overflow: "auto",
          }}
        >
          <Grid
            container
            spacing={0}
            direction="column"
            justifyContent="center"
            alignItems="center"
          >
            {data.length === 0 ? (
              <Typography>No banned users</Typography>
            ) : (
              data.map((username: string, key: number) => {
                return (
                  <Grid
                    key={key}
                    item
                    xs
                    sx={{ backgroundColor: "", width: "100%", height: "90%" }}
                  >
                    <Box
                      sx={{
                        background:
                          "linear-gradient(to right, #FE8F29, #FEAB5D, #FE8F29)",
                        borderWidth: "1px 0",
                        borderStyle: "solid",
                        borderImage:
                          "linear-gradient(to right, #d6d4d4, #00000000, #d6d4d4)",
                        borderImageSlice: "1 0",
                        marginTop: "0.5em",
                        padding: "0.1em",
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
                        <Grid container item alignItems="center" spacing={1}>
                          <Grid item>
                            <Avatar
                              src={`http://${
                                import.meta.env.VITE_IP
                              }:5000/api/avatar/${username}`}
                              alt="User Avatar"
                              sx={{
                                width: "2em",
                                height: "2em",
                                border: "black solid",
                                borderWidth: "1px",
                                borderRadius: "3em",
                                marginLeft: "1.5em",
                                marginRight: "0.3em",
                                cursor: "pointer",
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
                                cursor: "pointer",
                              }}
                            >
                              {username}
                            </Typography>
                          </Grid>
                        </Grid>

                        <Grid item>
                          <Button
                            onClick={() => {
                              unban(username);
                            }}
                            sx={{
                              backgroundColor: "#d4d4d4",
                              border: "black solid",
                              borderRadius: "10px",
                              borderWidth: "1px",
                              width: "30px",
                              height: "30px",
                              minWidth: "5px",
                              marginRight: "2em",
                            }}
                          >
                            <GavelIcon sx={{ fontSize: 20 }} />
                          </Button>
                        </Grid>
                      </Grid>
                    </Box>
                  </Grid>
                );
              })
            )}
          </Grid>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
