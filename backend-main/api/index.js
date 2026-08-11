const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");

const mainRouter = require("../routes/main.router");

dotenv.config();

const app = express();

app.use(express.json());

// CORS Configuration
app.use(
  cors({
    origin: [
      "https://effulgent-douhua-97cfa4.netlify.app",
      "http://localhost:3000",
      "http://localhost:5173"
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
  })
);

// Database Connection Handler (Serverless Compatible)
let isConnected = false;

const connectToDatabase = async () => {
  if (isConnected) return;
  
  const mongoURI = process.env.MONGODB_URI;
  if (!mongoURI) {
    console.error("MONGODB_URI environment variable is missing!");
    return;
  }
  
  try {
    const db = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 5000
    });
    isConnected = db.connections[0].readyState;
    console.log("MongoDB connected successfully!");
  } catch (err) {
    console.error("Unable to connect to MongoDB:", err);
  }
};

// Middleware to ensure DB connection on every request
app.use(async (req, res, next) => {
  await connectToDatabase();
  next();
});

// Health Check Route
app.get("/", (req, res) => {
  res.status(200).send("Backend Server is Running Successfully!");
});

// Main Routes
app.use("/", mainRouter);

// Export module for Vercel
module.exports = app;