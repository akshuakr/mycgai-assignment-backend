import app from "./express.js";
import connectMongo from "../db/mongo/mongo.js";
import logger from "../utils/logger.js";

export const initLoaders = async () => {
  try {
    await connectMongo();

    logger.info({
      source: "loaders",
      message: "All services initialized successfully!",
    });
  } catch (error) {
    logger.error({
      source: "loaders",
      message: "Service initialization failed",
      meta: { error: error.message },
    });
    throw error; // important for server to catch it
  }
};
