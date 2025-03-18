import express from "express";
import dotenv from "dotenv";
import pool from "./config/db";
import uploadRoutes from "./controllers/userController";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5500;

async function initializeDatabase() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        age INTEGER,
        address JSONB,
        additional_info JSONB
      )
    `);
    console.log("Database initialized successfully");
  } catch (error) {
    console.error("Error initializing database:", error);
    process.exit(1);
  }
}

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
