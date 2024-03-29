import React, {useEffect, useState} from "react";

import {useSelector} from "react-redux";

import {Box, Button, Grid} from "@mui/material";
import Drawer from "@mui/material/Drawer";
import PersonIcon from "@mui/icons-material/Person";

import UsersList from "./UsersList";
import {userRole} from "./chatEnums";

function UsersTab({roomName}: { roomName: string }) {
  const rooms = useSelector((state: any) => state.rooms);
  const roomIndex = rooms.room.findIndex(
    (obj: { name: string; role: userRole }) => obj.name === roomName,
  );

  const [isTabOpen, setIsTabOpen] = useState(false);
  const [role, setRole] = useState(userRole.none);

  const handleOpenTab = () => {
    setIsTabOpen(true);
  };

  const handleCloseTab = () => {
    setIsTabOpen(false);
  };

  useEffect(() => {
    const cRole = rooms.room.find(
      (obj: { name: string; role: userRole }) => obj.name === roomName,
    );
    if (cRole) setRole(cRole.role);
  }, [setRole, rooms, roomName]);

  return (
    <>
      <Button
        variant="text"
        onClick={handleOpenTab}
        disableRipple
        endIcon={
          <Box sx={{fontSize: 15, color: "black"}}>
            <PersonIcon
              style={{fontSize: "30px"}}
              sx={{
                "@media (max-width: 600px) or (max-height: 700px)": {
                  marginLeft: "1em",
                },
              }}
            />
          </Box>
        }
        sx={{
          padding: "0.5em",
          "&:hover": {
            backgroundColor: "rgba(255, 255, 255, 0)",
          },
          width: "auto",
          "& .MuiButton-label": {
            display: "flex",
            alignItems: "right",
            marginLeft: "auto",
          },
        }}
      ></Button>

      {/* Drawer for the tab */}
      <Drawer anchor="right" open={isTabOpen} onClose={handleCloseTab}>
        <Box
          sx={{
            width: "100%",
            height: "100%",
            background: "#FE8F29",
            padding: "45px",
          }}
        >
          <Box sx={{textAlign: "center", marginTop: "5%", color: "black"}}>
            <h1
              style={{
                fontWeight: "bold",
                fontSize: "42px",
              }}
            >
              Users
            </h1>
          </Box>
          <Grid container sx={{marginLeft: "5%"}}>
            <UsersList
              roomName={roomName}
              role={role}
              isDirectMessage={rooms.room[roomIndex].isDirectMsg}
            />
          </Grid>
        </Box>
      </Drawer>
    </>
  );
}

export default UsersTab;
