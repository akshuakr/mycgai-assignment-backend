import express from "express";
import authController from "../controllers/authController.js";
import { validateSignup } from "../validators/authValidator.js";


const router = express.Router();

router.post("/signup", validateSignup, authController.signup);

export default router;
