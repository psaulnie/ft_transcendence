import { useLocation } from "react-router";
import { SyntheticEvent, useEffect, useState } from "react";
import { Navigate } from "react-router";
import { Button, Typography } from "@mui/material";

import Cookies from "js-cookie";

function Login() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const refused = params.get("login-refused");
  const [isLoading, setIsLoading] = useState(true);
  const [isOk, setIsOk] = useState(false);

  async function apiIntraLogIn() {
    try {
      window.location.href = `http://${process.env.REACT_APP_IP}:5000/auth/login`;
    } catch (e) {
      console.log("Error from apiIntraLogIn(): ", e);
    }
  }

  function logIn(e: SyntheticEvent) {
    e.preventDefault();
    apiIntraLogIn();
  }

  function testlogin() {
    window.location.href = `http://${process.env.REACT_APP_IP}:5000/auth/testlogin`;
  }

  const fetchData = () => {
    fetch(`http://${process.env.REACT_APP_IP}:5000/auth/status`, {
      credentials: "include",
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        if (data.statusCode === 403) setIsOk(false);
        else setIsOk(data);
        setIsLoading(false);
      })
      .catch((error) => {
        setIsOk(false);
        setIsLoading(false);
        // TODO : handle fetch error
      });
  };
  useEffect(() => {
    fetchData();
  }, []);

  if (isLoading) return <div>Loading...</div>; // TODO : add a loading component
  if (isOk) return <Navigate to="/home" />;
  return (
    <div className="main">
        <Button
          variant="text"
          color="primary"
          onClick={logIn}
          sx={{
            textTransform: "none",
            fontWeight: "bold",
            fontSize: "36px",
            marginTop: "5em",
            width: "6em",
            height: "1.6em",
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            borderColor: "#000000",
            border: "2px solid",
            borderRadius: "15px",
            lineHeight: '3',
            color: "black",
            "&:hover": {
              backgroundColor: "red",
              borderColor: "red",
            },
          }}
        >
          <span
            style={{
              position: 'relative',
              top: '3px',
            }}
          >
            Login
          </span>
        </Button>
      <button type="button" onClick={testlogin}>
        Log as user test
      </button>
      {refused === "true" && (
        <div className="alert alert-warning">
          La connexion avec Intra42 a été refusée. Veuillez réessayer.
        </div>
      )}
      <Typography
        variant="h6"
        sx={{ fontSize: 18, fontWeight: "bold", color: "black", marginTop: "9em" }}
      >
        FT_Transcendence by:
      </Typography>
      <Typography variant="h6" sx={{ fontSize: 16, fontWeight: "bold", color: "black", }}> Lbattest </Typography>
      <Typography variant="h6" sx={{ fontSize: 16, fontWeight: "bold", color: "black", }}> Apercebo </Typography>
      <Typography variant="h6" sx={{ fontSize: 16, fontWeight: "bold", color: "black", }}> Psaulnie </Typography>
      <Typography variant="h6" sx={{ fontSize: 16, fontWeight: "bold", color: "black", }}> Dbouron </Typography>
    </div>
  );
}

export default Login;
