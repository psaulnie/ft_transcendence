import { useEffect, useState } from "react";

import { Routes, Route, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "./store/user";

import Navigation from "./components/Navigation/Navigation";
import NavDrawer from "./components/Navigation/NavDrawer";
import Game from "./components/Game/Game";
import Options from "./components/Global/Options";
import Profile from "./components/Global/Profile";
import Home from "./components/Home/Home";
import Chat from "./components/Chat/Chat";
import Achievements from "./components/Global/Achievements/Achievements";
import Modification from "./components/Global/Modification";
import Friendlist from "./components/Global/Friendlist";
import webSocketManager from "./webSocket";

export default function Base() {
  const user = useSelector((state: any) => state.user);
  const dispatch = useDispatch();

  const [drawerState, setDrawerState] = useState(false);
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

  useEffect(() => {
    webSocketManager.getSocket()?.on('disconnect', function () {
      localStorage.removeItem("user");
      window.location.href = `http://${process.env.REACT_APP_IP}:5000/auth/logout`;
    })
    if (!user || !user.username)
    {
      localStorage.removeItem("user");
      window.location.href = `http://${process.env.REACT_APP_IP}:5000/auth/logout`;
    }
  }, [dispatch, logout, user, user.username]);

  webSocketManager.initializeWebSocket();

  return (
    <div className="main">
      <Navigation setDrawerState={setDrawerState} />
      <NavDrawer state={drawerState} toggleDrawer={toggleDrawer} />
      <Routes>
        <Route path="*" element={<Navigate to="/home" />}></Route>
        <Route path="/home" element={<Home />}></Route>
        <Route path="/profile/:username" element={<Profile />}></Route>
        <Route path="/game" element={<Game />}></Route>
        <Route path="/options" element={<Options />}></Route>
        <Route
          path="/profile/:username/achievements"
          element={<Achievements />}
        ></Route>
        <Route path="/friendlist" element={<Friendlist />}></Route>
        <Route path="/edit" element={<Modification />}></Route>
      </Routes>
      <Chat />
    </div>
  );
}
