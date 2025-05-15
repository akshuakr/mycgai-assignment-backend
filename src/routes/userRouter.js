import express from "express";
import userController from "../controllers/userController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get(
  "/user-details",
  authMiddleware.verifyToken,
  userController.getUserDetails,
);

export default router;
