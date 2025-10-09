import { io } from "socket.io-client";

export const socket = io(
  process.env.NEXT_PUBLIC_SOCKET_URL! || "http://localhost:5000",
  {
    withCredentials: true,
    transports: ["websocket"],
  }
);

// Add connection logging
socket.on("connect", () => {
  console.log("✅ Socket connected:", socket.id);
});

socket.on("disconnect", () => {
  console.log("❌ Socket disconnected");
});

socket.on("connect_error", (error) => {
  console.error("❌ Socket connection error:", error);
});
