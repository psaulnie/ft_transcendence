import React, { useEffect, useState } from "react";

import PersonIcon from "@mui/icons-material/Person";
import falonsoImage from "./falonso.jpg";

import { Box, Grid, Button, Avatar, Typography } from "@mui/material";

interface GameProps {
  toggleGame: () => void;
}

function Game({ toggleGame }: GameProps) {
  const handleButtonClick = () => {
    toggleGame();
  };

  return <h1>Game</h1>;
}

export default Game;
