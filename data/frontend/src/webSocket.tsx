import {io} from "socket.io-client";

const URL = `ws://${import.meta.env.VITE_IP}:5000/gateway`;

export class WebSocketManager {
  private socket: any;
  private channel: BroadcastChannel;

  constructor() {
    this.socket = null;
    this.channel = new BroadcastChannel("tab");
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
          alert("You have opened a new tab. You will be logged out.");
          window.location.href = `http://${import.meta.env.VITE_IP}:5000/auth/logout`;
        }
      });
      window.onbeforeunload = () => {
        this.socket.close();
      };
      this.channel.postMessage("newTab");
      this.channel.addEventListener("message", (msg) => {
        if (msg.data === "newTab") {
          alert("You have opened a new tab. You will be logged out.");
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
