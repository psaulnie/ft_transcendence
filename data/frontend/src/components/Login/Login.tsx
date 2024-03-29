import {Navigate, useLocation} from "react-router";
import {SyntheticEvent, useEffect, useState} from "react";
import {Button, Grid} from "@mui/material";
import Loading from "../Global/Loading";
import { enqueueSnackbar } from "notistack";

function Login() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const refused = params.get("login-refused");
  const [isLoading, setIsLoading] = useState(true);
  const [clickButton, setClickButton] = useState(false);
  const [isOk, setIsOk] = useState(false);

  async function apiIntraLogIn() {
    setClickButton(true);
    try {
      window.location.href = `http://${import.meta.env.VITE_IP}:5000/auth/login`;
    } catch (e) {
      
      enqueueSnackbar("Error: " + e, { variant: 'error' });
      setClickButton(false);
    }
  }

  function logIn(e: SyntheticEvent) {
    e.preventDefault();
    apiIntraLogIn();
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

  if (isLoading) return <Loading/>;
  if (isOk) return <Navigate to="/home"/>;

  return (
    <div>
      {clickButton === true ? <Loading /> : null}
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
          disabled={clickButton}
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
        {refused === "true" && (
          <div className="alert alert-warning">
            La connexion avec Intra42 a été refusée. Veuillez réessayer.
          </div>
        )}
      </Grid>
    </div>
  );
}

export default Login;
