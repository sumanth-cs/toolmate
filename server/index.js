import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import mongoose from "mongoose";
import authRoutes from "./routes/authRoutes";
import toolRoutes from "./routes/toolRoutes";
import { errorHandler } from "./middleware/errorMiddleware";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

// Connect to MongoDB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    // don't exit since it's just placeholder if MONGODB_URI is YOUR_MONGO_DB_URL
    if (process.env.MONGODB_URI !== "YOUR_MONGO_DB_URL") {
      process.exit(1);
    }
  }
};

connectDB();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/tools", toolRoutes);

// Root path
app.get("/", (req, res) => {
  res.send("ToolMate AI Server Running...");
});

// Error handling middleware MUST be LAST
app.use(errorHandler);

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
