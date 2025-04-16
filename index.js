import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import "dotenv/config";
import session from "express-session";
import QueueController from "./controllers/queueController.js";
import UserController from "./controllers/userController.js";
import MovieController from "./controllers/movieController.js";

const CONNECTION_STRING = process.env.MONGO_CONNECTION_STRING || "mongodb://127.0.0.1:27017/upnext"
mongoose.connect(CONNECTION_STRING);
const app = express();
app.use(
  cors({
    credentials: true,
    origin: process.env.NETLIFY_URL || "http://localhost:5173",
  })
);
const sessionOptions = {
  secret: process.env.SESSION_SECRET || "upnext",
  resave: false,
  saveUninitialized: false,
};
if (process.env.NODE_ENV !== "development") {
  sessionOptions.proxy = true;
  sessionOptions.cookie = {
    sameSite: "none",
    secure: true,
    domain: process.env.NODE_SERVER_DOMAIN,
  };
}
app.use(session(sessionOptions));
app.use(express.json());
app.get('/', (req, res) => {
  res.send('hello world');
  res.end();
});

QueueController(app);
UserController(app);
MovieController(app);

app.listen(process.env.PORT || 4000);
console.log("Server running on port", process.env.PORT || 4000);
