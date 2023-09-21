import Cookies from "js-cookie";
import { io } from "socket.io-client";

const URL = `ws://${import.meta.env.VITE_IP}:5000/gateway`;
export class WebSocketManager {
  private socket: any;

  constructor() {
    this.socket = null;
  }

  initializeWebSocket() {
    if (!this.socket) {
      this.socket = io(URL, {
        withCredentials: true,
        transports: ["websocket"],
      });
      this.socket.on("connect_error", (err: any) => {
        console.log(err.message);
        window.location.href = `http://${import.meta.env.VITE_IP}:5000/auth/logout`;
      });
      this.socket.on("disconnect", function (err: any) {
        if (err === "io server disconnect") {
          window.location.href = `http://${import.meta.env.VITE_IP}:5000/auth/logout`;
        }
      });
    }
  }

  getSocket() {
    if (!this.socket) {
      window.location.href = `http://${import.meta.env.VITE_IP}:5000/auth/logout`;
    }
    return this.socket;
  }
}

const webSocketManager = new WebSocketManager();
export default webSocketManager;
