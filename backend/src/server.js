import express from 'express';
import cors from "cors";
import dotenv from "dotenv";
import ragRoutes from "./routes/ragRoutes.js";
import { testConnection } from "./utils/db.js";

dotenv.config();
const app = express();

app.use(express.json());
app.use(cors());

// Routes
app.use("/api/rag", ragRoutes);

// Start server
app.listen(5000, async () => {
  console.log('🚀 Server is running on port 5000');
  console.log('🔄 Testing database connection...');
  await testConnection();
});