import express from "express"
import { Server } from "socket.io"
import http from "http"
import { handleChatEvents } from "../controllers/chat.js";


export const setupSocket = (server) => {
    const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.emit("welcome", {
      message: "Welcome! Server sent this first 👋",
    });

    handleChatEvents(io, socket);

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });

  return io;
}