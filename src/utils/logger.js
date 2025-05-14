import winston from "winston";
import LogdnaWinston from "logdna-winston";
import config from "../config/mainConfig.js";

const logdnaOptions = {
  key: config.logdnaMezmoKey,
  // index_meta: true,
  indexMeta: true,
  app: "MYCGAI_BACKEND",
  env: "development",
};

const logger = winston.createLogger({
  level: "info",
  transports: [
    new LogdnaWinston(logdnaOptions),
    new winston.transports.Console(),
  ],
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
  ),
});

export default logger;
