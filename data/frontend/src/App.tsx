import "./App.css";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { login, setUsername } from "./store/user";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Cookies from "js-cookie";
import { SnackbarProvider } from "notistack";

// Components
import Login from "./components/Login/Login";
import Base from "./Base";

import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import PrivateRoute from "./components/Global/PrivateRoute";
import TwoFactorLogin from "./components/Login/TwoFactorLogin";
import { Snackbar } from "@mui/material";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#000000",
    },
    secondary: {
      main: "#ff9900",
    },
  },
});

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const username = Cookies.get("username");
    if (!username) {
      return;
    }
    dispatch(setUsername(username));
    dispatch(login());
    Cookies.remove("username", { sameSite: "strict", secure: false });
  }, [dispatch]);

  return (
    <div className="App">
      <SnackbarProvider maxSnack={5} anchorOrigin={{horizontal: 'right', vertical: 'top'}}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<Login />}></Route>
              <Route path="/2fa" element={<TwoFactorLogin />}></Route>
              <Route path="*" element={<PrivateRoute />}>
                <Route path="*" element={<Base />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </ThemeProvider>
      </SnackbarProvider>
    </div>
  );
}

export default App;
