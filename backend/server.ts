// server.ts
import express from "express";
import dotenv from "dotenv";
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
import { initSocket } from "./socket";

dotenv.config();

const app = express();
const server = http.createServer(app);
export const io = initSocket(server, app);

// Middlewares
app.use(helmet());
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);
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

export { app, server };
