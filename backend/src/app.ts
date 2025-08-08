import express, { Application, Request, Response } from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();
const app: Application = express();

// Use built-in middleware
app.use(cors());
app.use(express.json());

// Route example
app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Blog API is running with modern Express!" });
});

// Connect to MongoDB using latest Mongoose methods
const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI as string);

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
  } catch (error) {
    console.error("🔥 Database connection failed:", error);
    process.exit(1);
  }
};

startServer();
