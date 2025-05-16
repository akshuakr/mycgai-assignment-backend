import express from "express";
import userController from "../controllers/userController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import uploadMiddleware from "../middlewares/multer.js";

const router = express.Router();

router.get("/user-details", authMiddleware.verifyToken, userController.getUserDetails);

router.post(
  "/upload-file",
  authMiddleware.verifyToken,
  uploadMiddleware.single("file"),
  userController.uploadFile
);

router.get("/list-files", authMiddleware.verifyToken, userController.listFiles);

export default router;
