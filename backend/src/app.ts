import express, { Application, Request, Response } from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import { generateSessionToken } from "./middleware/auth";
import { loginUser, logoutUser } from "./controllers/authController";

dotenv.config();
const app: Application = express();

// Use built-in middleware
app.use(cors());
app.use(express.json());

// Route example
app.get("/", (req: Request, res: Response) => {
  res.json({ message: "News API is running with modern Express!" });
});

// Connect to MongoDB using latest Mongoose methods
const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI as string);

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
    console.log("http://localhost:5000/");
  } catch (error) {
    console.error("🔥 Database connection failed:", error);
    process.exit(1);
  }
};

startServer();

// Login and Logout user
app.post("/login", async (req, res) => {
  const sessionToken: string = await generateSessionToken(); // e.g., JWT
  
  res.cookie("authorization", sessionToken, {
    httpOnly: true,     // Can't be accessed by JS (XSS protection)
    secure: true,       // Cookie only sent over HTTPS
    sameSite: "strict", // Prevent CSRF
  });
  
  // Login user
  await loginUser(sessionToken, req, res);

  res.json({ message: "Logged in" });
});


app.post("/logout", async (req, res) => {
  // Logout user
  await logoutUser(req, res);

  // Clear cookie
  res.clearCookie("authorization");
  res.json({ message: "Logged out" });
});

