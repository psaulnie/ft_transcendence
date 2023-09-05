import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { useDispatch, useSelector } from "react-redux";
import user, { setUsername, login, logout } from "../../store/user";

import { Box, Grid, Button } from "@mui/material";

import Profile from "../Global/Profile";
import { useGetUserProfileQuery } from "../../store/api";

export default function Home() {
  const user = useSelector((state: any) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const play = () => {
    navigate("/game");
  }
  useEffect(() => {
    const username = Cookies.get("username");
    const accessToken = Cookies.get("accessToken");
    if (!username || !accessToken)
      return ;
    dispatch(setUsername(username));
    dispatch(login(accessToken));
  }, [dispatch]);

  const {
    data: userProfile,
    isLoading,
    isError,
  } = useGetUserProfileQuery({username: user.username});

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error</div>; // TODO handle error
  if (userProfile.exist === false) {
    dispatch(logout());
        window.location.href = `http://${process.env.REACT_APP_IP}:5000/auth/logout`;

  }
  return (
    <div>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "50vh",
          }}
        >
          <Grid
            container
            direction="column"
            spacing={2}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginTop: "50%",
            }}
          >
            <Grid item sx={{ marginBottom: "1em" }}>
              <Button
                variant="text"
                color="primary"
                onClick={play}
                sx={{
                  textTransform: "none",
                  fontWeight: "bold",
                  fontSize: "36px",
                  width: "6em",
                  height: "1.8em",
                  backgroundColor: "rgba(255, 255, 255, 0.9)",
                  borderColor: "#000000",
                  border: "3px solid",
                  borderRadius: "10px",
                  color: "black",
                  "&:hover": {
                    backgroundColor: "red",
                    borderColor: "red",
                  },
                }}
              >
                Play
              </Button>
            </Grid>
            <Grid item>
              <Box
                sx={{
                  top: "56%",
                  left: "25%",
                  width: "12em",
                  height: "10.2em",
                  padding: "0.5em",
                  borderRadius: "1.5em",
                  background: "linear-gradient(to right, #ECECEC, #d6d4d4)",
                  border: "2px solid #000000",
                  boxShadow: "0 0 10px rgba(0, 0, 0, 0.3)",
                }}
              >
                <Grid
                  container
                  spacing={0.2}
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Grid
                    item
                    sx={{
                      color: "black",
                      fontWeight: "bold",
                      fontSize: "24px",
                    }}
                  >
                    Welcome
                  </Grid>
                  <Grid
                    item
                    sx={{
                      color: "black",
                      fontWeight: "bold",
                      fontSize: "24px",
                    }}
                  >
                    Wins: {userProfile.wins}
                  </Grid>
                  <Grid
                    item
                    sx={{
                      color: "black",
                      fontWeight: "bold",
                      fontSize: "24px",
                    }}
                  >
                    Loses: {userProfile.loses}
                  </Grid>
                  <Grid
                    item
                    sx={{
                      color: "black",
                      fontWeight: "bold",
                      fontSize: "24px",
                    }}
                  >
                    Rank: {userProfile.rank}
                  </Grid>
                </Grid>
              </Box>
            </Grid>
          </Grid>
        </Box>
    </div>
  );
}
