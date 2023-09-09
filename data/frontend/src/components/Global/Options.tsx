import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";

import { Box, Grid, Button, Typography, Avatar, Stack } from "@mui/material";

import Switch from "@mui/material/Switch";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";

import orange from "../Game/img/orange.jpg";
import scooby from "../Game/img/scooby.jpg";
import roadrunner from "../Game/img/roadrunner.jpg";
import spongebob from "../Game/img/spongebob.jpg";
import windows from "../Game/img/windows.jpg";

import webSocketManager from "../../webSocket";

function Options() {
  const [twoFactorAuthState, setTwoFactorAuthState] = useState<boolean>(false);
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
          `http://${process.env.REACT_APP_IP}:5000/2fa/getState`,
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
        console.error("Error: ", error);
      }
    }
    checkTwoFactorState();
  }, []);

  async function changeTwoFactorAuthState() {
    try {
      const newState = !twoFactorAuthState;
      setTwoFactorAuthState(newState);
      const response = await fetch(
        `http://${process.env.REACT_APP_IP}:5000/2fa/changeState`,
        {
          method: "post",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ twoFactorAuthState: newState }),
        }
      );
      if (!response.ok) {
        console.error("Failed to fetch state of 2FA");
      }
      if (newState) {
        navigate("/2fa");
      }
    } catch (error) {
      console.error("Error: ", error);
    }
  }

  return (
    <Stack direction={"row"} justifyContent={"center"} alignItems={"center"} sx={{ width: 1, height: "75vh" }}>
      <Box
        sx={{
          // top: '25%',
          width: "30%",
          height: "40%",
          padding: "1em",
          borderRadius: "3em",
          background: "linear-gradient(to right, #ECECEC, #d6d4d4)",
          border: "1px solid #000000",
          boxShadow: "0 0 10px rgba(0, 0, 0, 0.3)",
        }}
      >
        <Grid
          container
          spacing={0}
          direction="column"
          justifyContent="center"
          alignItems="center"
        >
          <Grid item xs sx={{ width: "100%", height: "100%" }}>
            <Typography
              variant="h6"
              sx={{
                fontSize: 22,
                fontWeight: "bold",
                color: "black",
                marginLeft: "auto",
              }}
            >
              Background:
            </Typography>
          </Grid>
          <Grid
            item
            xs
            sx={{ backgroundColor: "", width: "100%", height: "90%" }}
          >
            <Grid
              container
              spacing={1}
              justifyContent="center"
              alignItems="center"
            >
              <Grid item xs={4}>
                <Button
                  sx={{ backgroundColor: "black", height: "4em", width: "4em" }}
                  onClick={() => {
                    webSocketManager
                      .getSocket()
                      .emit("changeBackground", "canvas");
                  }}
                ></Button>
              </Grid>
              <Grid item xs={4}>
                <Button
                  sx={{ height: "4em", width: "4em" }}
                  style={spongebobStyle}
                  onClick={() => {
                    webSocketManager
                      .getSocket()
                      .emit("changeBackground", "spongebob");
                  }}
                ></Button>
              </Grid>
              <Grid item xs={4}>
                <Button
                  sx={{ height: "4em", width: "4em" }}
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
          <Grid
            item
            xs
            sx={{
              backgroundColor: "",
              width: "100%",
              height: "90%",
              marginTop: "0.5em",
            }}
          >
            <Grid
              container
              spacing={1}
              justifyContent="center"
              alignItems="center"
            >
              <Grid item xs={4}>
                <Button
                  sx={{ height: "4em", width: "4em" }}
                  style={orangeStyle}
                  onClick={() => {
                    webSocketManager
                      .getSocket()
                      .emit("changeBackground", "orange");
                  }}
                ></Button>
              </Grid>
              <Grid item xs={4}>
                <Button
                  sx={{ height: "4em", width: "4em" }}
                  style={roadRunnerStyle}
                  onClick={() => {
                    webSocketManager
                      .getSocket()
                      .emit("changeBackground", "roadrunner");
                  }}
                ></Button>
              </Grid>
              <Grid item xs={4}>
                <Button
                  sx={{ height: "4em", width: "4em" }}
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
          <Grid item xs sx={{ width: "100%", height: "100%" }}>
            <Typography
              variant="h6"
              sx={{
                fontSize: 22,
                fontWeight: "bold",
                color: "black",
                marginLeft: "auto",
              }}
            >
              2FA:
            </Typography>
          </Grid>
          <Grid
            item
            xs
            sx={{ width: "100%", height: "100%", marginTop: "-0.3em" }}
          >
            <FormControl component="fieldset">
              <FormGroup aria-label="position" row>
                <FormControlLabel
                  value="start"
                  control={
                    <Switch
                      color="warning"
                      checked={twoFactorAuthState}
                      onChange={changeTwoFactorAuthState}
                      inputProps={{ "aria-label": "controlled" }}
                    />
                  }
                  label={twoFactorAuthState ? "Enabled" : "Disabled"}
                  sx={{ color: "black" }}
                  labelPlacement="start"
                />
              </FormGroup>
            </FormControl>
          </Grid>
        </Grid>
      </Box>
    </Stack>
  );
}

export default Options;
