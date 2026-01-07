import { body } from "express-validator";

// Registration Validation
export const registerationValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("name is required"),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("email is required")
    .isEmail()
    .withMessage("Please provide a valid email address")
    .normalizeEmail(),

  body("password")
    .isLength({ min: 6 })
    .withMessage("password must be at least 6 characters"),

  body("role")
    .optional()
    .isIn(["user", "admin"])
    .withMessage("Invalid role")
];

// Login Validation
export const loginValidation = [
  body("email")
    .trim()
    .isEmail()
    .withMessage("Please provide a valid email address")
    .normalizeEmail(),

  body("password")
    .notEmpty()
    .withMessage("Password is required")
];
