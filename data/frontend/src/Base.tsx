import { useEffect, useState } from "react";
import { SyntheticEvent } from "react";

import { Routes, Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "./store/user";

import Navigation from "./components/Navigation/Navigation";
import NavDrawer from "./components/Navigation/NavDrawer";
import Game from "./components/Game/Game";
import Options from "./components/Global/Options";
import Profile from "./components/Global/Profile";
import Home from "./components/Home/Home";
import Chat from "./components/Chat/Chat";
import webSocketManager from "./webSocket";

export default function Base() {
  const user = useSelector((state: any) => state.user);
  const dispatch = useDispatch();

  const [isProfilOpen, setIsProfilOpen] = useState(false);
  const [drawerState, setDrawerState] = useState(false);
  const [isGameOpen, setIsGameOpen] = useState(false);
  const toggleDrawer =
  (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
    if (
      event.type === "keydown" &&
      ((event as React.KeyboardEvent).key === "Tab" ||
      (event as React.KeyboardEvent).key === "Shift")
      ) {
        return;
      }
      setDrawerState(open);
    };
    
  const toggleProfil = () => {
    setIsProfilOpen(!isProfilOpen);
  };

  webSocketManager.initializeWebSocket();

  return (
    <div className="main">
      <Navigation setDrawerState={setDrawerState} />
      <NavDrawer state={drawerState} toggleDrawer={toggleDrawer} />
      <Routes>
        <Route path="/home" element={<Home />}></Route>
        <Route
          path="/profile"
          element={<Profile toggleProfil={toggleProfil} />}
        ></Route>
        <Route path="/game" element={<Game />}></Route>
        <Route path="/options" element={<Options />}></Route>
      </Routes>
      <Chat />
    </div>
  );
}
