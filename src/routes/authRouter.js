import express from "express";
import authController from "../controllers/authController.js";
import { validateSignup, validateLogin } from "../validators/authValidator.js";

const router = express.Router();

router.post("/signup", validateSignup, authController.signup);
router.post("/login", validateLogin, authController.login);

export default router;
