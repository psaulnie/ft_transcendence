import { useState } from "react";
import { SyntheticEvent } from "react";

import { Routes, Route } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "./store/user";

import Navigation from "./components/Navigation/Navigation";
import NavDrawer from "./components/Navigation/NavDrawer";
import Game from "./components/Game/Game";
import Options from "./components/Global/Options";
import Profile from "./components/Global/Profile";
import Home from "./components/Home/Home";
import Chat from "./components/Chat/Chat";
import Achievements from "./components/Global/Achievements";
import Modification from "./components/Global/Modification";

export default function Base() {
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
        <Route path="/achievements" element={<Achievements />}></Route>
        <Route
          path="/modification"
          element={<Modification toggleProfil={toggleProfil} />}
        ></Route>
      </Routes>
      <Chat />
    </div>
  );
}
