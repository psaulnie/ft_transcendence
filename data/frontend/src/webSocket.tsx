import { io } from "socket.io-client";

const URL = `ws://${process.env.REACT_APP_IP}:5000/gateway`;
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
        localStorage.removeItem("user");
        window.location.href = `http://${process.env.REACT_APP_IP}:5000/auth/logout`;
      });
    }
  }

  getSocket() {
    if (!this.socket)
    {
      localStorage.removeItem("user");
      window.location.href = `http://${process.env.REACT_APP_IP}:5000/auth/logout`;
    }
    return this.socket;
  }
}

const webSocketManager = new WebSocketManager();
export default webSocketManager;
