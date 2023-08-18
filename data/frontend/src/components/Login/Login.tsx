import { SyntheticEvent } from "react";
import { Navigate } from "react-router";

import Cookies from "js-cookie";

function Login() {
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

  if (Cookies.get("accessToken")) return <Navigate to="/home" />;
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
