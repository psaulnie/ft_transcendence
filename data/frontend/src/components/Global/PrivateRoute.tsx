import {Navigate, Outlet} from "react-router";
import {useEffect, useState} from "react";
import Loading from "./Loading";

export default function PrivateRoute() {
  const [isLoading, setIsLoading] = useState(true);
  const [isOk, setIsOk] = useState(false);

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
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (isLoading) return <Loading/>;
  if (isOk) {
    return <Outlet/>;
  }
  return <Navigate to="/login"/>;
}
