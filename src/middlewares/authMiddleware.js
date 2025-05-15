import jwt from "jsonwebtoken";
import config from "../config/mainConfig.js";
import logger from "../utils/logger.js";

const verifyToken = (req, res, next) => {
  try {
    const token = req.header("Authorization");
    if (!token) {
      logger.warn({
        source: "authMiddleware",
        message: `${req.ip} - Token not found`,
      });
      return res.status(401).json({ message: "Access Denied" });
    }

    const decoded = jwt.verify(token.replace("Bearer ", ""), config.jwtSecret);
    req.user = decoded;
    next();
  } catch (err) {
    logger.error({
      source: "authMiddleware",
      message: `${req.ip} - Invalid Token`,
    });
    return res.status(400).json({ message: "Invalid token" });
  }
};

export default { verifyToken };
