import express from 'express'
import { adminHealthController } from '~/controllers/admin/adminHealthController'
import { adminAuth } from '~/middlewares/adminMiddleware'

const router = express.Router()

/**
 * Admin Health Monitoring Routes
 * All routes require Admin authentication
 */

/**
 * @route   GET /admin/health
 * @desc    Get comprehensive system health status
 * @access  Admin only
 */
router.get('/', adminAuth, adminHealthController.getSystemHealth)

/**
 * @route   GET /admin/health/status
 * @desc    Get basic service status (lightweight check)
 * @access  Admin only
 */
router.get('/status', adminAuth, adminHealthController.getServiceStatus)

/**
 * @route   GET /admin/health/info
 * @desc    Get detailed system information
 * @access  Admin only
 */
router.get('/info', adminAuth, adminHealthController.getSystemInfo)

/**
 * @route   GET /admin/health/database
 * @desc    Get database health check only
 * @access  Admin only
 */
router.get('/database', adminAuth, adminHealthController.getDatabaseHealth)

/**
 * @route   GET /admin/health/resources
 * @desc    Get system resources health check only
 * @access  Admin only
 */
router.get('/resources', adminAuth, adminHealthController.getResourcesHealth)

/**
 * @route   GET /admin/health/summary
 * @desc    Get comprehensive health summary with health score
 * @access  Admin only
 */
router.get('/summary', adminAuth, adminHealthController.getHealthSummary)

export default router 