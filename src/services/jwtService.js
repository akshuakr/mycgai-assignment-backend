import jwt from "jsonwebtoken";
import config from "../config/mainConfig.js";

const generateAuthToken = (userId) => {
  const token = jwt.sign({ id: userId }, config.jwtSecret, {
    expiresIn: "1d",
  });
  return token;
};

export default generateAuthToken;
