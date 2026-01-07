// routes/auth.js
import express from "express";
import {
  loginUser,
  registerUser,
  registerUserAdmin,
} from "../controllers/authController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * @swagger
 * /auth/login:
 *
 *   post:
 *     tags:
 *       - Authentication
 *     summary: User login
 *     description: Authenticates a user using email or phone and password.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               phone:
 *                 type: number
 *                 example: 1234567890
 *               password:
 *                 type: string
 *                 example: "yourpassword"
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *       400:
 *         description: Invalid credentials
 */
router.post("/login", loginUser);
/**
 * @swagger
 * /auth/register:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Register a new user
 *     description: Creates a new user account with email, phone, username, and password.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               phone:
 *                 type: number
 *                 example: 1234567890
 *               username:
 *                 type: string
 *                 example: "newuser"
 *               password:
 *                 type: string
 *                 example: "yourpassword"
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: User already exists
 */
router.post("/register", registerUser);
/**
 * @swagger
 * /auth/admin/register:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Register a new admin
 *     description: Creates a new admin account with email, phone, username, and password. Protected by authentication middleware.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: admin@example.com
 *               phone:
 *                 type: number
 *                 example: 9876543210
 *               username:
 *                 type: string
 *                 example: "newadmin"
 *               password:
 *                 type: string
 *                 example: "yourpassword"
 *     responses:
 *       201:
 *         description: Admin registered successfully
 *       400:
 *         description: Admin already exists
 */
router.post("/admin/register", authMiddleware, registerUserAdmin);

export default router;
