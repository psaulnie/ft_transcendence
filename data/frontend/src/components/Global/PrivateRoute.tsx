import { Navigate, Outlet } from "react-router";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useSelector } from "react-redux";

export default function PrivateRoute() {
  const [isLoading, setIsLoading] = useState(true);
  const [isOk, setIsOk] = useState(false);

  const fetchData = () => {
    fetch(`http://${process.env.REACT_APP_IP}:5000/auth/status`, {
      credentials: "include",
      headers: {
        authorization: "Bearer " + Cookies.get("accessToken"),
      },
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
        if (Cookies.get("accessToken") === "test")
          // TODO remove when testUser no longer needed
          setIsOk(true);
        else setIsOk(false);
        setIsLoading(false);
        // TODO : handle fetch error
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (isLoading) return <div>Loading...</div>;
  if ((isOk) || Cookies.get("accessToken") === "test") {
    // TODO remove when testUser no longer needed
    return <Outlet />;
  }
  // return (null);
  return <Navigate to="/login" />;
}
