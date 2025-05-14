import morgan from "morgan";
import logger from "../utils/logger.js";

const captureUsernameForAuthLogging = (req, res, next) => {
  if (
    req.body &&
    (req.path.startsWith("/api/v1/auth/login") ||
      req.path.startsWith("/api/v1/auth/signup"))
  ) {
    req.usernameForLogging = req.body.username;
  }
  next();
};

morgan.token("user-info", (req) => {
  if (req.user && req.user.id) {
    return `userId: ${req.user.id}`;
  }
  if (req.usernameForLogging) {
    return `username: ${req.usernameForLogging}`;
  }
  return "";
});

const customFormat =
  ':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent" [:user-info] [:response-time ms]';

const successLogger = morgan(customFormat, {
  skip: (req, res) => res.statusCode >= 400,
  stream: {
    write: (message) =>
      logger.info({
        source: "http-logger",
        message: message.trim(),
      }),
  },
});

const warnLogger = morgan(customFormat, {
  skip: (req, res) => res.statusCode < 400 || res.statusCode >= 500,
  stream: {
    write: (message) =>
      logger.warn({
        source: "http-logger",
        message: message.trim(),
      }),
  },
});

const errorLogger = morgan(customFormat, {
  skip: (req, res) => res.statusCode < 500,
  stream: {
    write: (message) =>
      logger.error({
        source: "http-logger",
        message: message.trim(),
      }),
  },
});

const globalErrorLogger = (err, req, res, next) => {
  logger.error({
    source: "global-error-handler",
    message: err.err?.message || "Unhandled error occurred",
    context: err.funcName || "unknown function",
    user:
      err.username ||
      err.userId ||
      req.emailForLogging ||
      req.user?.id ||
      "unknown",
    ip: req.ip,
    meta: {
      stack: err.err?.stack,
      details: err.err,
    },
  });

  res.status(500).json({ message: "Internal Server Error" });
};

export {
  captureUsernameForAuthLogging,
  successLogger,
  warnLogger,
  errorLogger,
  globalErrorLogger,
};
