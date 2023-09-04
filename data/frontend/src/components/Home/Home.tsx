import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import { setUsername, login } from "../../store/user";

import PersonIcon from "@mui/icons-material/Person";

import { Box, Grid, Button } from "@mui/material";

import Profile from "../Global/Profile";

export default function Home() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isProfilOpen, setIsProfilOpen] = useState(false);
  const [isGameOpen, setIsGameOpen] = useState(false);

  const toggleProfil = () => {
    setIsProfilOpen(!isProfilOpen);
  };

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

  return (
    <div>
      {isProfilOpen ? (
        <Profile toggleProfil={toggleProfil} />
      ) : (
        /* {isGameOpen ? (<Profile toggleGame={toggleGame}/>) : ( A TROUVER SOLUTION */
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
                Jouer
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
                    Apercebo
                  </Grid>
                  <Grid
                    item
                    sx={{
                      color: "black",
                      fontWeight: "bold",
                      fontSize: "24px",
                    }}
                  >
                    Victoires: 4
                  </Grid>
                  <Grid
                    item
                    sx={{
                      color: "black",
                      fontWeight: "bold",
                      fontSize: "24px",
                    }}
                  >
                    Defaites: 2
                  </Grid>
                  <Grid
                    item
                    sx={{
                      color: "black",
                      fontWeight: "bold",
                      fontSize: "24px",
                    }}
                  >
                    Rang:
                  </Grid>
                </Grid>
              </Box>
            </Grid>
          </Grid>
        </Box>
      )}
    </div>
  );
}
