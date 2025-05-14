import mongoose from "mongoose";
import config from "../../config/mainConfig.js";
import logger from "../../utils/logger.js";

mongoose.connection.on("disconnected", () => {
  logger.warn({
    source: "MongoDB",
    message: "MongoDB disconnected",
  });
});

mongoose.connection.on("error", (err) => {
  logger.error({
    source: "MongoDB",
    message: "MongoDB connection error",
    meta: { error: err.message },
  });
});

const connectMongo = async () => {
  try {
    const conn = await mongoose.connect(config.mongoURI, {
      serverSelectionTimeoutMS: 5000,
    });
    logger.info({
      source: "MongoDB",
      message: `MongoDB connected: ${conn.connection.host}`,
    });
  } catch (err) {
    logger.error({
      source: "MongoDB",
      message: "MongoDB Connection Error",
      meta: { error: err.message },
    });
    process.exit(1);
  }
};

export default connectMongo;
