import express from "express";
import dotenv from "dotenv";
import pool from "./config/db";
import uploadRoutes from "./controllers/userController";
import { initializeDatabase } from "./utils/utils";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5500;

app.use(express.json());

initializeDatabase();

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "Service is healthy",
    timestamp: new Date().toISOString(),
  });
});

app.use("/api", uploadRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
