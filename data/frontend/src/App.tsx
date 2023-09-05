import "./App.css";

import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { login, setUsername } from "./store/user";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Cookies from "js-cookie";

// Components
import Login from "./components/Login/Login";
import Base from "./Base";

import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import PrivateRoute from "./components/Global/PrivateRoute";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#000000", // Red color
    },
    secondary: {
      main: "#ff9900", // Orange color
    },
  },
});

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const username = Cookies.get("username");
    const accessToken = Cookies.get("accessToken");
    if (!username || !accessToken) {
      return ;
    }
    dispatch(setUsername(username));
    dispatch(login(accessToken));
    Cookies.remove("username");
  }, [dispatch]);
throw new Exception('a');
  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />}></Route>
            <Route path="*" element={<PrivateRoute />}>
              <Route path="*" element={<Base />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </div>
  );
}

export default App;
