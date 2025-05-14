import express from "express";
import cors from "cors";
import router from "../routes/index.js";
import {
  successLogger,
  errorLogger,
  globalErrorLogger,
  captureEmailForAuthLogging,
  warnLogger,
} from "../middlewares/loggerMiddleware.js";

const app = express();

app.use(
  cors({
    origin: "*", // Allow all origins
    // origin: ["http://localhost:5173", "http://localhost:3000"], 
    //   credentials: true, // Allow sending cookies (if needed)
    //   allowedHeaders: ["Authorization", "Content-Type"], // Add any custom headers
  }),
);

app.use(express.json()); // Middleware for JSON parsing
app.set("trust proxy", true);
app.use(captureEmailForAuthLogging);
app.use(successLogger);
app.use(warnLogger);
app.use(errorLogger);
app.use("/api/v1", router);
app.use(globalErrorLogger);

export default app;
