import { SyntheticEvent, useEffect, useState } from "react";
import { Navigate } from "react-router";

import Cookies from "js-cookie";

function Login() {
  const [isLoading, setIsLoading] = useState(true);
  const [isOk, setIsOk] = useState(false);

  async function apiIntraLogIn() {
    try {
      window.location.href = "http://localhost:5000/auth/login";
    } catch (e) {
      console.log("Error from apiIntraLogIn(): ", e);
    }
  }

  function logIn(e: SyntheticEvent) {
    e.preventDefault();
    apiIntraLogIn();
  }

  const fetchData = () => {
    fetch("http://localhost:5000/auth/connected", {
      headers: {
        Authorization: "Bearer " + Cookies.get("accessToken"),
      },
    }).then((response) => {
      return response.json();
    }).then((data) => {
      setIsOk(data);
      setIsLoading(false);
    }).catch((error) => {
      setIsLoading(false);
      // TODO : handle error
    });
  };
  useEffect(() => {
    fetchData();
  }, []);

  if (isOk) return <Navigate to="/home" />;
  return (
    <div className="main">
      <p>Coucou from Login</p>
      <form>
        <button type="button" onClick={logIn}>
          LogIn
        </button>
      </form>
    </div>
  );
}

export default Login;
