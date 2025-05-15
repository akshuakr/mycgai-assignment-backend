import userModel from "../models/mongo/user.js";
import { HTTP_STATUS } from "../constants/httpStatusCodes.js";
import logger from "../utils/logger.js";

const getUserById = async (userId) => {
  try {
    const user = await userModel.findById(userId);
    if (!user) {
      logger.warn({
        source: "userHandler:getUserById",
        message: `${userId} - User not found in database`,
      });
      return {
        status: HTTP_STATUS.NOT_FOUND,
        message: "User not found",
        data: null,
      };
    }
    logger.info({
      source: "userHandler:getUserById",
      message: `${userId} - User found in database`,
    });
    return {
      status: HTTP_STATUS.OK,
      message: "User details retrieved successfully",
      data: {
        id: user._id.toString(),
        name: user.name,
        username: user.username,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    };
  } catch (err) {
    logger.error({
      source: "userHandler:getUserById",
      message: `${userId} - Unexpected error during finding user`,
      user: userId,
      meta: { error: err.message },
    });
    throw err;
  }
};

export { getUserById };
