import express from 'express'
const router = express.Router()
import * as sitesController from '../controllers/sitesController.js'
import authMiddleware from '../middleware/authMiddleware.js'
import authorizePermissions from '../middleware/permissionsMiddleware.js'

// ===== SITE SETUP AND MANAGEMENT =====
router.get('/', authMiddleware, authorizePermissions('sites.read'), sitesController.getAllSites)
router.get('/:id', authMiddleware, authorizePermissions('sites.read'), sitesController.getOneSite)
router.post('/', authMiddleware, authorizePermissions('sites.write'), sitesController.createSite)
router.patch('/:id', authMiddleware, authorizePermissions('sites.update'), sitesController.updateSite)
router.delete('/:id', authMiddleware, authorizePermissions('sites.delete'), sitesController.deleteSite)

// ===== GATE MANAGEMENT =====
router.get('/gates', authMiddleware, authorizePermissions('sites.read'), sitesController.getAllGates)
router.get('/gates/:id', authMiddleware, authorizePermissions('sites.read'), sitesController.getOneGateForSite)
router.get('/:id/gates', authMiddleware, authorizePermissions('sites.read'), sitesController.getAllGatesForSite)
router.post('/gates', authMiddleware, authorizePermissions('sites.write'), sitesController.createGate)
router.patch('/gates/:id', authMiddleware, authorizePermissions('sites.write'), sitesController.updateGate)
router.delete('/gates/:id', authMiddleware, authorizePermissions('sites.write'), sitesController.deleteGate)

// ===== GUARD ASSIGNMENT TO GATES =====
router.post('/gates/:id/guards', authMiddleware, authorizePermissions('gates.write'), sitesController.assignGuardsToGate)
router.delete('/gates/:id/guards/:guardId', authMiddleware, authorizePermissions('gates.write'), sitesController.removeGuardFromGate)
router.get('/gates/:id/guards', authMiddleware, authorizePermissions('gates.write'), sitesController.getAllGuardsForGate)

// ===== USER ASSIGNMENT TO SITES =====
router.post('/:id/users', authMiddleware, authorizePermissions('sites.write'), sitesController.assignUserToSite)
router.delete('/:id/users/:userId', authMiddleware, authorizePermissions('sites.write'), sitesController.removeUserFromSite)
router.get('/:id/users', authMiddleware, authorizePermissions('sites.read'), sitesController.getAllUsersForSite)

// ===== ANALYTICS AND MONITORING =====
router.get('/:id/visitors/live-count', authMiddleware, authorizePermissions('sites.read'), sitesController.getLiveVisitorCount)
router.get('/:id/analytics/daily-count', authMiddleware, authorizePermissions('sites.read'), sitesController.getSiteDailyVisitorCount)
router.get('/:id/analytics/peak-hours', authMiddleware, authorizePermissions('sites.read'), sitesController.getSitePeakHours)

// ===== EXPORT LOGS =====
router.get('/:id/logs/export', authMiddleware, authorizePermissions('sites.read'), sitesController.exportSiteLogs)
export default router