import { validationResult } from "express-validator";
import { registerUser, loginUser } from "../handlers/authHandler.js";
import { HTTP_STATUS } from "../constants/httpStatusCodes.js";

const signup = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(HTTP_STATUS.UNPROCESSABLE_ENTITY).json({ errors: errors.array() });
    }

    const result = await registerUser(
      req.body.name,
      req.body.username,
      req.body.password
    );

    return res.status(result.status).json({ message: result.message, data: result.data });
  } catch (err) {
    return next({
      err,
      username: req.body.username,
      funcName: "authController:signup",
    });
  }
};

const login = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(HTTP_STATUS.UNPROCESSABLE_ENTITY)
        .json({ errors: errors.array() });
    }

    const response = await loginUser(req.body.username, req.body.password);

    return res
      .status(response.status)
      .json({ message: response.message, data: response.data });
  } catch (err) {
    return next({
      err,
      email: req.body.email,
      funcName: "authController:login",
    });
  }
};

export default { signup, login };
