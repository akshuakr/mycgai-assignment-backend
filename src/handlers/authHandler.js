import bcrypt from "bcrypt";
import userModel from "../models/mongo/user.js";
import { HTTP_STATUS } from "../constants/httpStatusCodes.js";
import logger from "../utils/logger.js";
import generateAuthToken from "../services/jwtService.js";


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

const loginUser = async (username, password) => {
  try {
    const user = await userModel.findOne({ username });
    if (!user) {
      logger.warn({
        source: "authHandler:loginUser",
        message: `${username} - LogIN Failed - User Not Found`,
        user: username,
      });
      return {
        status: HTTP_STATUS.UNAUTHORIZED,
        message: "Invalid credentials",
        data: {
          isLogInSuccessful: 0,
          doesUserExist: 0,
        },
      };
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      logger.warn({
        source: "authHandler:loginUser",
        message: `${username} - LogIN Failed - Incorrect Password`,
        user: username,
      });
      return {
        status: HTTP_STATUS.UNAUTHORIZED,
        message: "Invalid credentials",
        data: {
          isLogInSuccessful: 0,
          doesUserExist: 1,
        },
      };
    }

    const userId = user._id.toString();
    const token = generateAuthToken(userId);

    logger.info({
      source: "authHandler:loginUser",
      message: `${username} - LogIN Successful - Token Issued`,
      user: username,
    });

    return {
      status: HTTP_STATUS.OK,
      message: "LogIn successful",
      data: {
        isLogInSuccessful: 1,
        doesUserExist: 1,
        token,
      },
    };
  } catch (err) {
    logger.error({
      source: "authHandler:loginUser",
      message: `${username} - Unexpected error during login`,
      user: username,
      meta: { error: err.message },
    });
    throw err;
  }
};

export { registerUser, loginUser };
