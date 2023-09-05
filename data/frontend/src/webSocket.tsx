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
      });
    }
  }

  getSocket() {
    return this.socket;
  }
}

const webSocketManager = new WebSocketManager();
export default webSocketManager;