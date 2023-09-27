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
import { MaterialDesignContent } from 'notistack'
import { styled } from "@mui/system";

const StyledMaterialDesignContent = styled(MaterialDesignContent)(({ theme }) => ({
  '&.notistack-MuiContent-error': {
    backgroundColor: '#FFC2C2',
    color: '#8F0000',
  },
  '&.notistack-MuiContent-success': {
    backgroundColor: '#B7E4C7',
    color: '#2D6A4F',
  },
  '&.notistack-MuiContent-info': {
    backgroundColor: '#9CBFE8',
    color: '#133153',
  },
}));

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
      <SnackbarProvider maxSnack={5} anchorOrigin={{horizontal: 'right', vertical: 'top'}} autoHideDuration={10000} Components={{
    error: StyledMaterialDesignContent,
    success: StyledMaterialDesignContent,
    info: StyledMaterialDesignContent,
  }}>
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
