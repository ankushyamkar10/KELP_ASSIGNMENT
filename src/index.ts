import express from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5500;


app.use(express.json());

app.get('/health', (req, res) => {
  res.status(200).json({
      status: 'OK',
      message: 'Service is healthy',
      timestamp: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
