// server.ts
import express from "express";
import dotenv from "dotenv";
import { Server } from "socket.io";
import http from "http";
// Middlewares
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import bodyParser from "body-parser";
// Routes
import authRoutes from "./routes/auth.routes";
import activitiesRoutes from "./routes/activities.routes";
import timeRoutes from "./routes/time.routes";
import regRoutes from "./routes/registration.routes";

dotenv.config();

const app = express();
const server = http.createServer(app);

export const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Middlewares
app.use(helmet());
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/activities", activitiesRoutes);
app.use("/api/time", timeRoutes);
app.use("/api/reg", regRoutes);

app.get("/", (req, res) => {
  res.send("API HealthCheck...");
});

io.on("connection", (socket) => {
  console.log(`🔌 User connected: ${socket.id}`);

  socket.on("disconnect", () => {
    console.log(`❌ User disconnected: ${socket.id}`);
  });
});

export { app, server };
