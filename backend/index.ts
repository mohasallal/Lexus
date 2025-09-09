import express from "express";
import dotenv from "dotenv";
//Middlewares
import helmet from "helmet";
import cors from "cors";
//Routes
import authRoutes from "./routes/auth.routes";

dotenv.config();
const app = express();

//Middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Routes
app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("API HealthCheck...");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
