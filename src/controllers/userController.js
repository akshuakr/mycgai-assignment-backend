import { getUserById } from "../handlers/userHandler.js";

const getUserDetails = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const result = await getUserById(userId);
    return res
      .status(result.status)
      .json({ message: result.message, data: result.data });
  } catch (err) {
    return next({
      err,
      userId: req.user.id,
      funcName: "userController:getUserDetails",
    });
  }
};

export default { getUserDetails };
