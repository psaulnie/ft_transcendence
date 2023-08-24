import Cookies from "js-cookie";
import { io } from "socket.io-client";

const URL = `http://${process.env.REACT_APP_IP}:5000/gateway`;

export const webSocket = io(URL, {
  auth: { token: Cookies.get("accessToken") },
});
