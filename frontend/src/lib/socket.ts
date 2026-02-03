import { Socket, io } from "socket.io-client";

const deployedBaseURL = "https://9jataxes.pxxl.click";
const localBaseURL = "http://localhost:5000";
console.log("Socket URLS - Local:", localBaseURL, "Deployed:", deployedBaseURL);

const baseURL = deployedBaseURL;

let socket: Socket | null = null;

export const initSocket = (): Socket => {
  if (!socket) {
    console.log("Initializing new socket connection to:", baseURL);

    socket = io(baseURL, {
      withCredentials: true,
      autoConnect: false,
      transports: ["websocket"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
    });

    // Connection events
    socket.on("connect", () => {
      console.log("Socket connected:", socket?.id);
    });

    socket.on("connect_error", (err) => {
      console.error("Socket connection error:", err);
    });

    socket.on("disconnect", (reason) => {
      console.warn("Socket disconnected:", reason);
    });

    socket.on("reconnect_attempt", (attempt) => {
      console.log("Socket reconnect attempt:", attempt);
    });

    socket.on("reconnect_failed", () => {
      console.error("Socket reconnection failed after max attempts");
    });

    socket.on("reconnect_error", (err) => {
      console.error("Socket reconnection error:", err);
    });

    socket.on("error", (err) => {
      console.error("Socket general error:", err);
    });
  }

  return socket;
};

export const connectSocket = (): Socket => {
  const s = initSocket();
  if (!s.connected) {
    console.log("Connecting socket...");
    s.connect();
  } else {
    console.log("Socket already connected:", s.id);
  }
  return s;
};

export const disconnectSocket = () => {
  if (socket?.connected) {
    console.log("Disconnecting socket:", socket.id);
  } else {
    console.log("Socket already disconnected or not initialized");
  }
  socket?.disconnect();
};
