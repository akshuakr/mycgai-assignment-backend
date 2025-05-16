import { getUserById, uploadFile as uploadFileHandler } from "../handlers/userHandler.js";

const getUserDetails = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const result = await getUserById(userId);
    return res.status(result.status).json({ message: result.message, data: result.data });
  } catch (err) {
    return next({
      err,
      userId: req.user.id,
      funcName: "userController:getUserDetails",
    });
  }
};

const uploadFile = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const file = req.file;
    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    const result = await uploadFileHandler(userId, file, "pdf"); // Specify file type as "pdf"
    return res.status(result.status).json({ message: result.message, data: result.data });
  } catch (err) {
    return next({
      err,
      userId: req.user.id,
      funcName: "userController:uploadFile",
    });
  }
};

export default { getUserDetails, uploadFile };
