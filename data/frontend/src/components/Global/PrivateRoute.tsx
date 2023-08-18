import { Navigate, Outlet } from "react-router";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";

export default function PrivateRoute() {
  const [isLoading, setIsLoading] = useState(true);
  const [isOk, setIsOk] = useState(false);
  const fetchData = () => {
    fetch("http://localhost:5000/auth/connected", {
      headers: {
        Authorization: "Bearer " + Cookies.get("accessToken"),
      },
    }).then((response) => {
      setIsOk(response.ok);
      setIsLoading(false);
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (isLoading) return <div>Loading...</div>;
  if (isOk) {
    return <Outlet />;
  }
  return <Navigate to="/login" />;
}
