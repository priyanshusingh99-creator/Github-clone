const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");
const http = require("http");
const { Server } = require("socket.io");

const mainRouter = require("../routes/main.router");

const yargs = require("yargs");
const { hideBin } = require("yargs/helpers");

const { initRepo } = require("../controllers/init");
const { addRepo } = require("../controllers/add");
const { commitRepo } = require("../controllers/commit");
const { pushRepo } = require("../controllers/push");
const { pullRepo } = require("../controllers/pull");
const { revertRepo } = require("../controllers/revert");

dotenv.config();

const app = express();

app.use(express.json());

// CORS Config
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

// Serverless-Friendly MongoDB Connection Handler
let isConnected = false;

const connectToDatabase = async () => {
  if (isConnected) {
    return;
  }
  const mongoURI = process.env.MONGODB_URI;
  if (!mongoURI) {
    console.warn("MONGODB_URI environment variable is missing!");
    return;
  }
  try {
    const db = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 5000,
    });
    isConnected = db.connections[0].readyState;
    console.log("MongoDB connected successfully!");
  } catch (err) {
    console.error("Unable to connect to MongoDB:", err);
  }
};

// Middleware to ensure DB connection on every request (Vercel)
app.use(async (req, res, next) => {
  await connectToDatabase();
  next();
});

// Health Check Route
app.get("/", (req, res) => {
  res.send("Backend Server is Running Successfully!");
});

// Main Routes
app.use("/", mainRouter);

// Local Server Runner
function startServer() {
  const port = process.env.PORT || 3002;
  const host = process.env.HOST || "127.0.0.1";

  let user = "test";
  const httpServer = http.createServer(app);
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    socket.on("joinRoom", (userID) => {
      user = userID;
      console.log("=====");
      console.log(user);
      console.log("=====");
      socket.join(userID);
    });
  });

  const db = mongoose.connection;
  db.once("open", async () => {
    console.log("CRUD operations called");
  });

  httpServer.listen(port, host, () => {
    console.log(`Server is running at http://${host}:${port}`);
  });
}

// Run Yargs CLI only locally
if (!process.env.VERCEL && process.argv.length > 2) {
  yargs(hideBin(process.argv))
    .command("start", "Starts a new server", {}, startServer)
    .command("init", "Initialise a new repository", {}, initRepo)
    .command(
      "add <file>",
      "Add a file to the repository",
      (yargs) => {
        yargs.positional("file", {
          describe: "File to add to the staging area",
          type: "string",
        });
      },
      (argv) => {
        addRepo(argv.file);
      }
    )
    .command(
      "commit <message>",
      "Commit the staged files",
      (yargs) => {
        yargs.positional("message", {
          describe: "Commit message",
          type: "string",
        });
      },
      (argv) => {
        commitRepo(argv.message);
      }
    )
    .command("push", "Push commits to S3", {}, pushRepo)
    .command("pull", "Pull commits from S3", {}, pullRepo)
    .command(
      "revert <commitID>",
      "Revert to a specific commit",
      (yargs) => {
        yargs.positional("commitID", {
          describe: "Commit ID to revert to",
          type: "string",
        });
      },
      (argv) => {
        revertRepo(argv.commitID);
      }
    )
    .demandCommand(1, "You need at least one command")
    .help().argv;
}

module.exports = app;