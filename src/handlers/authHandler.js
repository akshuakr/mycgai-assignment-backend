import bcrypt from "bcrypt";
import userModel from "../models/mongo/user.js";
import { HTTP_STATUS } from "../constants/httpStatusCodes.js";
import logger from "../utils/logger.js";

const registerUser = async (name, username, password) => {
  try {
    const existingUser = await userModel.findOne({ username });
    if (existingUser) {
      logger.warn({
        source: "authHandler:registerUser",
        message: `${username} - username already in use. User already exist, Can't register`,
        user: username,
      });
      return {
        status: HTTP_STATUS.CONFLICT,
        message: "username already in use",
        data: { isRegistrationSuccessful: 0, doesUserAlreadyExisted: 1 },
      };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new userModel({
      name,
      username,
      password: hashedPassword,
    });

    await user.save();
    logger.info({
      source: "authHandler:registerUser",
      message: `${username} - User registered successfully`,
      user: username,
    });
    return {
      status: HTTP_STATUS.CREATED,
      message: "User registered successfully",
      data: { isRegistrationSuccessful: 1, doesUserAlreadyExisted: 0 },
    };
  } catch (err) {
    logger.error({
      source: "authHandler:registerUser",
      message: `${username} - Unexpected error during registration`,
      user: username,
      meta: { error: err.message },
    });
    throw err;
  }
};

export { registerUser };
