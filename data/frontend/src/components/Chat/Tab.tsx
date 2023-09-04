import React, { useState } from "react";

import CreateChannel from "./CreateChannel";
import JoinChannel from "./JoinChannel";
import JoinDirectMessage from "./JoinDirectMessage";

import { Box, Grid, Button,} from "@mui/material";
import Drawer from "@mui/material/Drawer";
import MenuIcon from "@mui/icons-material/Menu";

function Tab() {
  const [isTabOpen, setIsTabOpen] = useState(false);

  const handleOpenTab = () => {
    setIsTabOpen(true);
  };

  const handleCloseTab = () => {
    setIsTabOpen(false);
  };

  return (
    <>
      <Button
        variant="text"
        onClick={handleOpenTab}
        startIcon={
          <Box sx={{ fontSize: 30, color: "black" }}>
            <MenuIcon sx={{ marginLeft: "1.8em", width: "auto" }} />
          </Box>
        }
        sx={{
          padding: "0.7em",
          "&:hover": {
            backgroundColor: "rgba(255, 255, 255, 0)",
          },
          "& .MuiButton-startIcon": {
            marginRight: "0.25em",
          },
          "& .MuiButton-label": {
            display: "flex",
            alignItems: "center",
          },
        }}
      ></Button>

      {/* Drawer for the tab */}
      <Drawer anchor="right" open={isTabOpen} onClose={handleCloseTab}>
        <Box
          sx={{
            width: "15.4em",
            height: "100%",
            background: "#FE8F29",
            padding: "1em",
          }}
        >
          <Grid container>
            <JoinDirectMessage />
            <JoinChannel />
          </Grid>
          <Grid container>
            <CreateChannel />
          </Grid>
          <Grid container>
            <Button sx={{color:'white', marginLeft:'6em', marginTop:'1.6em', height:'1.8em', fontSize:'12px'}}>Cancel</Button>
          </Grid>
        </Box>
      </Drawer>
    </>
  );
}

export default Tab;
