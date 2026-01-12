import express from "express";
const router = express.Router();
import * as contactMessagesController from "../controllers/contactMessagesController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import authorizePermissions from "../middleware/permissionsMiddleware.js";


/**
 * @swagger
 * /contact-messages:
 *   get:
 *     tags:
 *       - Contact Messages
 *     summary: Get all contact messages
 *     responses:
 *       200:
 *         description: List of contact messages
 */
router.get(
  "/",
  authMiddleware,
  authorizePermissions("admin", "manager"),
  contactMessagesController.getAllContactMesssages
);

/**
 * @swagger
 * /contact-messages/{id}:
 *   get:
 *     tags:
 *       - Contact Messages
 *     summary: Get a contact message by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Contact message details
 */
router.get(
  "/:id",
  authMiddleware,
  authorizePermissions("admin", "manager"),
  contactMessagesController.getOneContactMessage
);

/**
 * @swagger
 * /gates:
 *   post:
 *     tags:
 *       - Contact Messages
 *     summary: Create a contact message
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
 *         description: Contact message created
 */
router.post(
  "/",
  contactMessagesController.createContactMessage
);


/**
 * @swagger
 * /contact-messages/{id}:
 *   delete:
 *     tags:
 *       - Contact Messages
 *     summary: Delete a contact message by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Contact message deleted
 */
router.delete(
  "/:id",
  authMiddleware,
  authorizePermissions("admin"),
  contactMessagesController.deleteContactMessage
);



export default router;