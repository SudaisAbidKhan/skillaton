import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  }),
);

app.use(
  express.json({
    limit: "16kb",
  }),
);

app.use(
  express.urlencoded({
    extended: true,
    limit: "16kb",
  }),
);

app.use(express.static("public"));

app.use(cookieParser());

// Routes import
import authRouter from "./routes/auth.route.js";
import complaintRouter from "./routes/complaint.route.js";
import eventRouter from "./routes/event.route.js";
import fypRouter from "./routes/fyp.route.js";
import notificationRouter from "./routes/notification.route.js";

// Routes declaration
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/complaints", complaintRouter);
app.use("/api/v1/events", eventRouter);
app.use("/api/v1/fyp", fypRouter);
app.use("/api/v1/notifications", notificationRouter);

export { app };
