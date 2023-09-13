import { Navigate, Outlet } from "react-router";
import { useEffect, useState } from "react";
import Loading from "./Loading";
import { useDispatch, useSelector } from "react-redux";

export default function PrivateRoute() {
  const user = useSelector((state: any) => state.user);
  const dispatch = useDispatch();
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
    // TODO add when removing testUser
    // if (!user || !user.username) {
    //   localStorage.removeItem("user");
    //   window.location.href = `http://${process.env.REACT_APP_IP}:5000/auth/logout`;
    // }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (isLoading) return <Loading />;
  if (isOk) {
    return <Outlet />;
  }
  // return (null);
  return <Navigate to="/login" />;
}
