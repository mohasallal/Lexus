import { Server } from "socket.io";
import http from "http";
import { Express } from "express";

let io: Server;

export const initSocket = (server: http.Server, app: Express) => {
  io = new Server(server, {
    cors: { origin: "http://localhost:3000", methods: ["GET", "POST"] },
  });

  io.on("connection", (socket) => {
    console.log("🔌 User connected:", socket.id);

    socket.on("disconnect", () => {
      console.log("❌ User disconnected:", socket.id);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) throw new Error("Socket.io not initialized!");
  return io;
};
