import React from "react";

import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import HomeIcon from "@mui/icons-material/Home";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";
import SettingsIcon from "@mui/icons-material/Settings";
import { Grid, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function NavDrawer({
  state,
  toggleDrawer,
}: {
  state: boolean;
  toggleDrawer: any;
}) {
  const navigate = useNavigate();

  const handleHomeClick = () => {
    toggleDrawer(false);
    navigate("/home"); // Navigate to the '/home' route
  };

  const handleEsportsClick = () => {
    toggleDrawer(false);
    navigate("/game");
  };

  const handleSettingsClick = () => {
    toggleDrawer(false);
    navigate("/options");
  };

  return (
    <Drawer anchor="top" open={state} onClose={toggleDrawer(false)}>
      <Box
        onClick={toggleDrawer(false)}
        onKeyDown={toggleDrawer(false)}
        sx={{
          position: "fixed",
          paddingTop: "1.4em",
          bgcolor: "#FE8F29",
          height: "1em",
          width: "100%",
          opacity: 0.8,
          borderColor: "#FE8F29",
          marginTop: "auto",
          top: "3.5em",
          right: 0,
          zIndex: 9,
          "@media (max-width: 600px) or (max-height: 700px)": {
            width: "100%",
            height: "5em",
          },
        }}
      >
        <Grid
          container
          spacing={3}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Grid
            item
            xs={4}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Button
              variant="text"
              sx={{ marginLeft: "auto" }}
              onClick={handleHomeClick}
            >
              <HomeIcon />
            </Button>
          </Grid>
          <Grid
            item
            xs={4}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Button variant="text" sx={{}} onClick={handleEsportsClick}>
              <SportsEsportsIcon />
            </Button>
          </Grid>
          <Grid
            item
            xs={4}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Button
              variant="text"
              sx={{ marginRight: "auto" }}
              onClick={handleSettingsClick}
            >
              <SettingsIcon />
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Drawer>
  );
}
