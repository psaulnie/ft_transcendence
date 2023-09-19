import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import { Grid } from "@mui/material";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";

import { useSelector } from "react-redux";

import CustomAvatar from "../Global/CustomAvatar";
import { useNavigate } from "react-router-dom";
import { SyntheticEvent } from "react";
import { apiSlice } from "../../store/api";
import ErrorSnackbar from "../Global/ErrorSnackbar";

function Navigation({ setDrawerState }: { setDrawerState: any }) {
  const user = useSelector((state: any) => state.user);
  const query = apiSlice.endpoints.getUserRank.useQueryState({});
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [rank, setRank] = useState(0);
  const open = Boolean(anchorEl);

  const handleBoxClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleProfileClick = () => {
    navigate(`/profile/${user.username}`);
  };

  function logoutButton(e: SyntheticEvent) {
    e.preventDefault();
    localStorage.removeItem("user");
    window.location.href = `http://${import.meta.env.VITE_IP}:5000/auth/logout`;
  }

  useEffect(() => {
    if (query.isUninitialized === false && query.isSuccess === true) {
      setRank(query.data);
    }
  }, [query]);

  if (query.isError) return <ErrorSnackbar error={query.error} />;
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        position="static"
        sx={{ backgroundColor: "#FC7D07", height: "3.5em" }}
      >
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <IconButton
            size="large"
            edge="start"
            aria-label="menu"
            sx={{ mr: 2, color: "black" }}
            onClick={() => setDrawerState(true)}
          >
            <MenuIcon />
          </IconButton>
          <Grid
            item
            xs={9}
            sx={{
              marginLeft: "auto",
              color: "black",
              marginRight: "1em",
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
              alignItems: "flex-end",
            }}
          >
            <div>{user.username}</div>
            <div>Rank {rank}</div>
          </Grid>
          <Grid item xs={3}>
            <Box
              sx={{
                marginLeft: "auto",
                position: "relative",
                textAlign: "center",
                cursor: "pointer",
              }}
              onClick={handleBoxClick}
            >
                <CustomAvatar username={user.username} />
            </Box>
            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleMenuClose}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "center",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "center",
              }}
            >
              <MenuItem
                onClick={handleMenuClose}
                sx={{ backgroundColor: "white" }}
              >
                <Button
                  variant="outlined"
                  size="small"
                  onClick={handleProfileClick}
                  sx={{ width: "100%" }}
                >
                  Show Profile
                </Button>
              </MenuItem>
              <MenuItem
                onClick={handleMenuClose}
                sx={{ backgroundColor: "white" }}
              >
                <Button
                  variant="outlined"
                  size="small"
                  onClick={logoutButton}
                  sx={{ width: "100%" }}
                >
                  Logout
                </Button>
              </MenuItem>
            </Menu>
          </Grid>
        </Toolbar>
      </AppBar>
    </Box>
  );
}

export default Navigation;
