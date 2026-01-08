import express from "express";
const router = express.Router();
import * as sitesController from "../controllers/sitesController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import authorizePermissions from "../middleware/permissionsMiddleware.js";

router.use(authMiddleware);

/**
 * @swagger
 * /sites:
 *   get:
 *     tags:
 *       - Sites
 *     summary: Get all sites
 *     responses:
 *       200:
 *         description: List of sites
 */
router.get(
  "/",
  authorizePermissions("admin", "manager"),
  sitesController.getAllSites
);
/**
 * @swagger
 * /sites/{id}:
 *   get:
 *     tags:
 *       - Sites
 *     summary: Get a site by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Site details
 */
router.get(
  "/:id",
  authorizePermissions("admin", "manager"),
  sitesController.getOneSite
);
/**
 * @swagger
 * /sites:
 *   post:
 *     tags:
 *       - Sites
 *     summary: Create a site
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: Site created
 */
router.post("/", authorizePermissions("admin"), sitesController.createSite);
/**
 * @swagger
 * /sites/{id}:
 *   patch:
 *     tags:
 *       - Sites
 *     summary: Update a site
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
 *         description: Site updated
 */
router.patch("/:id", authorizePermissions("admin"), sitesController.updateSite);
/**
 * @swagger
 * /sites/{id}:
 *   delete:
 *     tags:
 *       - Sites
 *     summary: Delete a site
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Site deleted
 */
router.delete(
  "/:id",
  authorizePermissions("admin"),
  sitesController.deleteSite
);

/**
 * @swagger
 * /sites/{id}/users:
 *   post:
 *     tags:
 *       - User Assignments
 *     summary: Assign user to site
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
 *       201:
 *         description: User assigned
 */

/**
 * @swagger
 * /sites/{id}/logs/export:
 *   get:
 *     tags:
 *       - Logs
 *     summary: Export site logs
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Site logs exported
 */
router.get(
  "/:id/logs/export",
  authorizePermissions("admin", "manager"),
  sitesController.exportSiteLogs
);
export default router;
