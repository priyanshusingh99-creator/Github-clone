const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");
const http = require("http");
const { Server } = require("socket.io");
const mainRouter = require("./routes/main.router");

const yargs = require("yargs");
const { hideBin } = require("yargs/helpers");

const { initRepo } = require("./controllers/init");
const { addRepo } = require("./controllers/add");
const { commitRepo } = require("./controllers/commit");
const { pushRepo } = require("./controllers/push");
const { pullRepo } = require("./controllers/pull");
const { revertRepo } = require("./controllers/revert");

dotenv.config();

// 1. Initialize Express App at top-level for Vercel
const app = express();

app.use(express.json());
app.use(cors({ origin: "*" }));

// Database Connection
const mongoURI =
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/githubclone";

mongoose
  .connect(mongoURI)
  .then(() => console.log("MongoDB connected!"))
  .catch((err) => console.error("Unable to connect : ", err));

// Routes
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

// 2. Run Yargs CLI only locally (bypasses Vercel deployment check)
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
          describe: "Comit ID to revert to",
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

// 3. Export Express App for Vercel
module.exports = app;