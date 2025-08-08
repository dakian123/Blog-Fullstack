import express from "express";
import cookieParser from "cookie-parser"
import { generateSessionToken } from "../middleware/auth";
import { loginUser, logoutUser } from "./userController";

const app = express();
app.use(cookieParser());

app.post("/login", async (req, res) => {
  const sessionToken: string = await generateSessionToken(); // e.g., JWT
  
  res.cookie("authorization", sessionToken, {
    httpOnly: true,     // Can't be accessed by JS (XSS protection)
    secure: true,       // Cookie only sent over HTTPS
    sameSite: "strict", // Prevent CSRF
  });
  
  // Login user
  await loginUser(sessionToken);

  res.json({ message: "Logged in" });
});


app.post("/logout", async (req, res) => {
  // Logout user
  await logoutUser();

  // Clear cookie
  res.clearCookie("authorization");

  res.json({ message: "Logged out" });
});
