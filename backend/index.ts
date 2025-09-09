import express from "express";
import dotenv from "dotenv";
//Middlewares
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import bodyParser from "body-parser";
//Routes
import authRoutes from "./routes/auth.routes";
import activitiesRoutes from "./routes/activities.routes";
import timeRoutes from "./routes/time.routes";
import regRoutes from "./routes/registration.routes";

dotenv.config();
const app = express();

//Middlewares
app.use(helmet());
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Routes
app.use("/api/auth", authRoutes);
app.use("/api/activities", activitiesRoutes);
app.use("/api/time", timeRoutes);
app.use("/api/reg", regRoutes);

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("API HealthCheck...");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
