import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./Routes/RauthRoutes.js";
import bookingRoutes from "./Routes/bookingRoutes.js";
import providerRoutes from "./Routes/providerRoutes.js";
import path from "path";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// MongoDB
mongoose
  .connect(process.env.MONGO_URI_ATLAS)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log("❌ MongoDB Connection Error:", err));

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/provider", providerRoutes);
app.get("/api/test", (req, res) => {
  res.json({ message: "Backend is working!" });
});

// Deployment config
const __dirname = path.resolve();
if (process.env.NODE_ENV === "production") {
  const frontendPath = path.join(__dirname, "../Frontend/dist");
  app.use(express.static(frontendPath));

  app.get("/*", (req, res) => {
    res.sendFile(path.join(frontendPath, "index.html"));
  });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
