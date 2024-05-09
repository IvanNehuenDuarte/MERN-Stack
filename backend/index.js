import express from "express";
import cors from "cors";

import "dotenv/config";
import mongoose from "mongoose";
import User from "./models/user.model.js";

import jwt from "jsonwebtoken";
import { authenticateToken } from "./utilities.js";

// Conexión DB
mongoose.connect(process.env.CONNECTION_STRING);

const app = express();

// Uso de archivos Json
app.use(express.json());

// Cors para conectar back y front
app.use(
  cors({
    origin: "*",
  })
);

app.get("/", (req, res) => {
  res.json({ data: "Hello" });
});

// Create Account
app.post("/create-account", async (req, res) => {
  const { fullName, email, password } = req.body;

  // Datos requeridos
  if (!fullName) {
    return res
      .status(400)
      .json({ error: true, message: "Full Name is required" });
  }

  if (!email) {
    return res.status(400).json({ error: true, message: "Email is required" });
  }

  if (!password) {
    return res
      .status(400)
      .json({ error: true, message: "Password is required" });
  }

  // Buscamos si existe el usuario
  const isUser = await User.findOne({ email: email });
  // Si el usuario existe
  if (isUser) {
    return res.json({
      error: true,
      message: "User already exist",
    });
  }

  // Si el usuario no existe, lo creamos y guardamos
  const user = new User({
    fullName,
    email,
    password,
  });

  await user.save();

  // Verificamos token, si está correcto retornamos un mensaje
  const accessToken = jwt.sign({ user }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "36000m",
  });

  return res.json({
    error: false,
    user,
    accessToken,
    message: "Registration Successful",
  });
});

// Login User
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  if (!password) {
    return res.status(400).json({ message: "Password is required" });
  }

  // Verificamos que exista el correo
  const userInfo = { email, password };

  if (!userInfo) {
    return res.status(400).json({ message: "User not found" });
  }

  if (userInfo.email === email && userInfo.password === password) {
    const user = { user: userInfo };
    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "36000",
    });

    return res.json({
      error: false,
      message: "Login Successful",
      email,
      accessToken,
    });
  } else {
    return res
      .status(400)
      .json({ error: true, message: "Invalid Credentials" });
  }
});

// Conexión al servidor
const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server started at ${PORT}`);
});

export default app;
