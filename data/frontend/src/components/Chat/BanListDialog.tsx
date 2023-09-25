import {Avatar, Box, Button, Dialog, DialogContent, DialogTitle, Grid, Typography, Zoom,} from "@mui/material";
import {TransitionProps} from "@mui/material/transitions";
import React from "react";
import {useGetBanListQuery} from "../../store/api";
import Loading from "../Global/Loading";
import ErrorSnackbar from "../Global/ErrorSnackbar";
import webSocketManager from "../../webSocket";

import GavelIcon from "@mui/icons-material/Gavel";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Zoom ref={ref} {...props} style={{transitionDelay: "100ms"}}>{props.children}</Zoom>;
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
  const {data, isError, isLoading, error, refetch} = useGetBanListQuery({
    roomName,
  });

  if (isLoading) return <Loading/>;
  if (isError) return <ErrorSnackbar error={error}/>;

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
      <DialogTitle>Banned users</DialogTitle>
      <DialogContent sx={{overflow: "auto"}}>
        <Box
          sx={{
            height: "100%",
            overflow: "auto",
          }}
        >
          <Grid
            container
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
                    sx={{width: "100%", height: "90%"}}
                  >
                    <Box
                      sx={{
                        background:
                          "linear-gradient(to right, #FE8F29, #FEAB5D, #FE8F29)",
                        marginTop: "0.2em",
                      }}
                    >
                      <Grid
                        container
                        direction="row"
                        alignItems="center"
                        sx={{flexWrap: "nowrap"}}
                        justifyContent="space-between"
                      >
                        <Grid container item alignItems="center" spacing={1} sx={{flexWrap: "nowrap"}}>
                          <Grid item>
                            <Avatar
                              src={`http://${
                                import.meta.env.VITE_IP
                              }:5000/api/avatar/${username}`}
                              alt="User Avatar"
                              sx={{
                                width: "1.5em",
                                height: "1.5em",
                                border: "1px solid #00000",
                                margin: "3px 0.5em 3px 1em",
                              }}
                            />
                          </Grid>
                          <Grid item>
                            <Typography
                              variant="h6"
                              sx={{
                                fontSize: 16,
                                color: "black",
                              }}
                            >
                              {username}
                            </Typography>
                          </Grid>
                        </Grid>

                        <Grid container item alignItems="center">
                          <Button
                            onClick={() => {
                              unban(username);
                            }}
                            sx={{
                              backgroundColor: "#00000000",
                              '&:hover': {
                                backgroundColor: '#00000000',
                              },
                            }}
                          >
                            <GavelIcon sx={{fontSize: 18}}/>
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
