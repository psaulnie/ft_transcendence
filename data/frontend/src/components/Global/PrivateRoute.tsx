import { Navigate, Outlet } from "react-router";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import Loading from "./Loading";

export default function PrivateRoute() {
  const [isLoading, setIsLoading] = useState(true);
  const [isOk, setIsOk] = useState(false);

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
      .catch(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (isLoading) return <Loading />
  if (isOk) {
    // TODO remove when testUser no longer needed
    return <Outlet />;
  }
  // return (null);
  return <Navigate to="/login" />;
}
