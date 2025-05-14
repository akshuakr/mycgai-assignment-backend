import app from "./src/loaders/express.js";
import config from "./src/config/mainConfig.js";
import { initLoaders } from "./src/loaders/index.js";
import logger from "./src/utils/logger.js";

const startServer = async () => {
  try {
    await initLoaders(); // Initialize MySQL, MongoDB, etc.

    const PORT = config.port;
    app.listen(PORT, () => {
      logger.info({
        source: "server",
        message: `Server running on http://localhost:${PORT}`,
      });
    });
  } catch (error) {
    logger.error({
      source: "server",
      message: "Failed to start server",
      meta: { error: error.message },
    });
    process.exit(1);
  }
};

startServer();
