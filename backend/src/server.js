import express from "express";
import { connectDB } from "./config/db.js";
import cors from "cors";
import dotenv from "dotenv";
import ragRoutes from "./routes/ragRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import path from "path";

const PORT = process.env.PORT || 5000;
const __dirname = path.resolve();

dotenv.config();
const app = express();

app.use(express.json());
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
connectDB();

// if (process.env.NODE_ENV === "production") {
//   app.use(express.static(path.join(__dirname, "../frontend/dist")));

//   app.get("*", (req, res) => {
//     res.sendFile(path.join(__dirname, "../frontend/dist", "index.html"));
//   });
// }

// Routes
app.use("/api/rag", ragRoutes);
app.use("/api/users", userRoutes);
// ✅ Health check route
app.get("/", (req, res) => {
  res.send("✅ Backend is running successfully on Vercel!");
});
// Start server
app.listen(PORT, async () => {
  console.log("🚀 Server is running on port 5000");
  console.log("🔄 Testing database connection...");
});
