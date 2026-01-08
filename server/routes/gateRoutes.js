import express from "express";
const router = express.Router();
import * as gatesController from "../controllers/gatesController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import authorizePermissions from "../middleware/permissionsMiddleware.js";

router.use(authMiddleware);

/**
 * @swagger
 * /gates:
 *   get:
 *     tags:
 *       - Gates
 *     summary: Get all gates
 *     responses:
 *       200:
 *         description: List of gates
 */
router.get(
  "/",
  authorizePermissions("admin", "manager"),
  gatesController.getAllGates
);

/**
 * @swagger
 * /gates/{id}:
 *   get:
 *     tags:
 *       - Gates
 *     summary: Get a gate by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Gate details
 */
router.get(
  "/:id",
  authorizePermissions("admin", "manager"),
  gatesController.getGateById
);

/**
 * @swagger
 * /gates:
 *   post:
 *     tags:
 *       - Gates
 *     summary: Create a gate
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               site:
 *                 type: string
 *               status:
 *                 type: string
 *     responses:
 *       201:
 *         description: Gate created
 */
router.post(
  "/",
  authorizePermissions("admin"),
  gatesController.createGate
);

/**
 * @swagger
 * /gates/{id}:
 *   patch:
 *     tags:
 *       - Gates
 *     summary: Update a gate
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Gate updated
 */
router.patch(
  "/:id",
  authorizePermissions("admin"),
  gatesController.updateGate
);

/**
 * @swagger
 * /gates/{id}:
 *   delete:
 *     tags:
 *       - Gates
 *     summary: Delete a gate
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Gate deleted
 */
router.delete(
  "/:id",
  authorizePermissions("admin"),
  gatesController.deleteGate
);

export default router;