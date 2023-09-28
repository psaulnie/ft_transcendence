import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router";

import {Box, Button, Grid, Typography} from "@mui/material";

import Switch from "@mui/material/Switch";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import orange from "../Game/img/orange.jpg";
import scooby from "../Game/img/scooby.jpg";
import roadrunner from "../Game/img/roadrunner.jpg";
import spongebob from "../Game/img/spongebob.jpg";
import windows from "../Game/img/windows.jpg";

import webSocketManager from "../../webSocket";
import { enqueueSnackbar } from "notistack";

function Settings() {
  const [twoFactorAuthState, setTwoFactorAuthState] = useState<boolean>(false);
  const [open, setOpen] = React.useState(false);
  const [twoFactorAuthCode, setTwoFactorAuthCode] = useState("");
  const [error, setError] = useState<boolean>(false);
  const navigate = useNavigate();

  const spongebobStyle = {
    backgroundImage: "url(" + spongebob + ")",
    backgroundSize: "cover",
  };
  const windowsStyle = {
    backgroundImage: "url(" + windows + ")",
    backgroundSize: "cover",
  };
  const roadRunnerStyle = {
    backgroundImage: "url(" + roadrunner + ")",
    backgroundSize: "cover",
  };
  const orangeStyle = {
    backgroundImage: "url(" + orange + ")",
    backgroundSize: "cover",
  };
  const scoobyStyle = {
    backgroundImage: "url(" + scooby + ")",
    backgroundSize: "cover",
  };

  useEffect(() => {
    async function checkTwoFactorState() {
      try {
        const response = await fetch(
          `http://${import.meta.env.VITE_IP}:5000/2fa/getState`,
          {
            method: "post",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const data = await response.json();
        if (response.ok) {
          setTwoFactorAuthState(data);
        } else {
          console.error("Unexpected response:", data);
        }
      } catch (error) {
        enqueueSnackbar("Error: " + error, { variant: 'error' });
      }
    }

    checkTwoFactorState();
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.repeat) return;
      const {key} = event;

      if (key === "Enter") {
        if (twoFactorAuthCode) validateTwoFactorAuthCode();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  });

  function onChangeAuthCode(e: string) {
    if (e.length <= 6) {
      setTwoFactorAuthCode(e);
    }
  }

  async function askForChangeTwoFactorAuthState() {
    const newState = !twoFactorAuthState;
    setTwoFactorAuthState(newState);
    if (!newState) {
      handleClickOpen();
    } else {
      await changeTwoFactorAuthState(newState);
    }
  }

  async function changeTwoFactorAuthState(state: boolean) {
    try {
      const response = await fetch(
        `http://${import.meta.env.VITE_IP}:5000/2fa/changeState`,
        {
          method: "post",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({twoFactorAuthState: state}),
        }
      );
      if (!response.ok) {
        console.error("Failed to fetch state of 2FA");
      }
      if (state) {
        navigate("/2fa");
      }
    } catch (error) {
      enqueueSnackbar("Error: " + error, { variant: 'error' });
    }
  }

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setTwoFactorAuthState(true);
    setError(false);
  };

  async function validateTwoFactorAuthCode() {
    try {
      const response = await fetch(
        `http://${import.meta.env.VITE_IP}:5000/2fa/authenticate`,
        {
          method: "post",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({twoFactorAuthCode: twoFactorAuthCode}),
        }
      );
      const data = await response.json();
      if (response.ok && data.status !== "codeError") {
        await changeTwoFactorAuthState(false);
        setError(false);
        setOpen(false);
      } else {
        setError(true);
      }
    } catch (error) {
      enqueueSnackbar("Error: " + error, { variant: 'error' });
      navigate("/login");
    }
  }

  return (
    <Grid
      container
      direction='column'
      sx={{
        position: "absolute",
        height: '94%',
        width: '100%',
      }}
    >
      <Grid item sx={{position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)'}}>
        <Box
          sx={{
            width: "30em",
            height: "27em",
            borderRadius: "1.5em",
            background: "#d6d4d470",
            border: "1px solid #00000032",
            paddingTop: '10px',
            boxShadow: "0 0 10px rgba(0, 0, 0, 0.3)",
            backdropFilter: 'blur(8px)',
          }}
        >
          <Grid container direction="column" justifyContent="center" alignItems="center">

            <Typography variant="h6" sx={{fontSize: 22, fontWeight: "bold", color: "black", margin: '1em 0em 1em 0em'}}>Game
              background</Typography>

            <Grid item xs sx={{width: "100%", height: "90%"}}>
              <Grid container justifyContent="center" alignItems="center">

                <Grid item xs={3}>
                  <Button
                    sx={{backgroundColor: "black", height: "6em", width: "6em"}}
                    onClick={() => {
                      webSocketManager
                        .getSocket()
                        .emit("changeBackground", "canvas");
                    }}
                  ></Button>
                </Grid>

                <Grid item xs={3}>
                  <Button
                    sx={{height: "6em", width: "6em"}}
                    style={spongebobStyle}
                    onClick={() => {
                      webSocketManager
                        .getSocket()
                        .emit("changeBackground", "spongebob");
                    }}
                  ></Button>
                </Grid>

                <Grid item xs={3}>
                  <Button
                    sx={{height: "6em", width: "6em"}}
                    style={windowsStyle}
                    onClick={() => {
                      webSocketManager
                        .getSocket()
                        .emit("changeBackground", "windows");
                    }}
                  ></Button>
                </Grid>

              </Grid>
            </Grid>

            <Grid item xs sx={{backgroundColor: "", width: "100%", height: "90%", marginTop: "0.5em",}}>
              <Grid container justifyContent="center" alignItems="center">

                <Grid item xs={3}>
                  <Button
                    sx={{height: "6em", width: "6em"}}
                    style={orangeStyle}
                    onClick={() => {
                      webSocketManager
                        .getSocket()
                        .emit("changeBackground", "orange");
                    }}
                  ></Button>
                </Grid>

                <Grid item xs={3}>
                  <Button
                    sx={{height: "6em", width: "6em"}}
                    style={roadRunnerStyle}
                    onClick={() => {
                      webSocketManager
                        .getSocket()
                        .emit("changeBackground", "roadrunner");
                    }}
                  ></Button>
                </Grid>

                <Grid item xs={3}>
                  <Button
                    sx={{height: "6em", width: "6em"}}
                    style={scoobyStyle}
                    onClick={() => {
                      webSocketManager
                        .getSocket()
                        .emit("changeBackground", "scooby");
                    }}
                  ></Button>
                </Grid>
              </Grid>
            </Grid>

            <Typography variant="h6" sx={{fontSize: 22, fontWeight: "bold", color: "black", margin: '2em 0 0.8em 0'}}>Two
              factor authentication</Typography>

            <Grid item sx={{width: "100%", height: "100%"}}>
              <FormControl component="fieldset">
                <FormGroup aria-label="position" row>
                  <FormControlLabel
                    value="start"
                    control={
                      <Switch
                        color="warning"
                        checked={twoFactorAuthState}
                        onChange={askForChangeTwoFactorAuthState}
                        inputProps={{"aria-label": "controlled"}}
                      />
                    }
                    label={twoFactorAuthState ? "Enabled" : "Disabled"}
                    sx={{color: "black"}}
                    labelPlacement="start"
                  />
                </FormGroup>
              </FormControl>
            </Grid>

          </Grid>
        </Box>
      </Grid>

      <div>
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Two Factor Authentication</DialogTitle>
          <DialogContent>
            <DialogContentText>
              To disable two factor authentication, please enter your validation code
            </DialogContentText>
            <TextField
              autoFocus
              placeholder="Validation code"
              margin="dense"
              id="code"
              value={twoFactorAuthCode}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                onChangeAuthCode(event.target.value);
              }}
              variant="outlined"
            />
            {error && (
              <p style={{color: "red"}}>Incorrect code, please try again.</p>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={validateTwoFactorAuthCode}>Validate</Button>
          </DialogActions>
        </Dialog>
      </div>
    </Grid>
  );
}

export default Settings;
