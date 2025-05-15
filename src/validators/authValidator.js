import { body } from "express-validator";

const validateSignup = [
  body("name").notEmpty().withMessage("Name is required"),
  body("username").notEmpty().withMessage("Username is required"),
  body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
];

const validateLogin = [
  body("username").notEmpty().withMessage("Username required"),
  body("password").notEmpty().withMessage("Password is required"),
];

export { validateSignup, validateLogin };
