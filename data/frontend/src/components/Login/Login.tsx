import { useLocation } from "react-router";
import { SyntheticEvent, useEffect, useState } from "react";
import { Navigate } from "react-router";
import { Button, Grid } from "@mui/material";
import Loading from "../Global/Loading";

function Login() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const refused = params.get("login-refused");
  const [isLoading, setIsLoading] = useState(true);
  const [isOk, setIsOk] = useState(false);

  async function apiIntraLogIn() {
    try {
      window.location.href = `http://${import.meta.env.VITE_IP}:5000/auth/login`;
    } catch (e) {
      console.log("Error from apiIntraLogIn(): ", e);
    }
  }

  function logIn(e: SyntheticEvent) {
    e.preventDefault();
    apiIntraLogIn();
  }

  function testlogin() {
    window.location.href = `http://${import.meta.env.VITE_IP}:5000/auth/testlogin`;
  }

  const fetchData = () => {
    fetch(`http://${import.meta.env.VITE_IP}:5000/auth/status`, {
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
      .catch(() => {
        setIsOk(false);
        setIsLoading(false);
      });
  };
  useEffect(() => {
    fetchData();
  }, []);

  if (isLoading) return <Loading />;
  if (isOk) return <Navigate to="/home" />;

  return (
    <Grid
      container
      direction="column"
      justifyContent="center"
      alignItems="center"
      sx={{
        position: "absolute",
        left: "50%",
        top: "50%",
        transform: "translate(-50%, -50%)",
      }}
    >
      <Button
        variant="text"
        onClick={logIn}
        sx={{
          textTransform: "none",
          fontWeight: "bold",
          fontSize: "36px",
          width: "6em",
          height: "1.6em",
          backgroundColor: "#D4D4D4",
          border: "1px solid #00000088",
          boxShadow: "0 0 10px rgba(0, 0, 0, 0.3)",
          borderRadius: "15px",
          lineHeight: "3",
          color: "black",
          "&:hover": {
            backgroundColor: "gray",
          },
        }}
      >
        Login
      </Button>
      <Button
        variant='contained'
        onClick={testlogin}
        sx={{
          textTransform: "none",
          fontSize: "16px",
          width: "12em",
          height: "1.6em",
          backgroundColor: "#D4D4D4",
          border: "1px solid #00000088",
          boxShadow: "0 0 10px rgba(0, 0, 0, 0.3)",
          borderRadius: "10px",
          color: "black",
          "&:hover": {
            backgroundColor: "gray",
          },
          marginTop: '2em',
        }}
      >
        Log as user test
      </Button>

      {refused === "true" && (
        <div className="alert alert-warning">
          La connexion avec Intra42 a été refusée. Veuillez réessayer.
        </div>
      )}
    </Grid>
  );
}

export default Login;
