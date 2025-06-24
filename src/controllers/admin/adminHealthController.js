import ApiResponse from '~/utils/ApiResponse'
import { catchAsync } from '~/utils/catchAsync'
import logger from '~/utils/logger'
import { healthService } from '~/services/healthService'

/**
 * Admin Health Monitoring Controller
 * Provides endpoints for system health monitoring and diagnostics
 */

/**
 * Get comprehensive system health status
 * GET /admin/health
 */
const getSystemHealth = catchAsync(async (req, res) => {
  logger.info('Health check requested', {
    requestedBy: req.user?.id,
    userRole: req.user?.role,
    endpoint: '/admin/health'
  })

  const healthData = await healthService.checkSystemHealth()

  return res.status(200).json(
    ApiResponse.success(healthData, 'System health check completed')
  )
})

/**
 * Get basic service status (lightweight check)
 * GET /admin/health/status
 */
const getServiceStatus = catchAsync(async (req, res) => {
  const serviceStatus = healthService.getServiceStatus()

  return res.status(200).json(
    ApiResponse.success(serviceStatus, 'Service status retrieved')
  )
})

/**
 * Get system information (for debugging/monitoring)
 * GET /admin/health/info
 */
const getSystemInfo = catchAsync(async (req, res) => {
  logger.info('System info requested', {
    requestedBy: req.user?.id,
    userRole: req.user?.role,
    endpoint: '/admin/health/info'
  })

  const systemInfo = healthService.getSystemInfo()

  return res.status(200).json(
    ApiResponse.success(systemInfo, 'System information retrieved')
  )
})

/**
 * Get database health check only
 * GET /admin/health/database
 */
const getDatabaseHealth = catchAsync(async (req, res) => {
  const databaseHealth = await healthService.checkDatabaseConnection()

  return res.status(200).json(
    ApiResponse.success(databaseHealth, 'Database health check completed')
  )
})

/**
 * Get system resources health check only
 * GET /admin/health/resources
 */
const getResourcesHealth = catchAsync(async (req, res) => {
  const resourcesHealth = healthService.checkSystemResources()

  return res.status(200).json(
    ApiResponse.success(resourcesHealth, 'System resources health check completed')
  )
})

/**
 * Get comprehensive health summary with all components
 * GET /admin/health/summary
 */
const getHealthSummary = catchAsync(async (req, res) => {
  logger.info('Health summary requested', {
    requestedBy: req.user?.id,
    userRole: req.user?.role,
    endpoint: '/admin/health/summary'
  })

  const healthData = await healthService.checkSystemHealth()
  
  // Create a summary with overall status and component statuses
  const summary = {
    overallStatus: healthData.status,
    timestamp: healthData.timestamp,
    uptime: healthData.uptime,
    environment: healthData.environment,
    componentStatus: {
      database: healthData.checks.database.status,
      apiResponseTime: healthData.checks.apiResponseTime.status,
      systemResources: healthData.checks.systemResources.status
    },
    issues: [],
    healthScore: 0
  }

  // Calculate health score (0-100)
  let totalComponents = 0
  let healthyComponents = 0

  Object.entries(healthData.checks).forEach(([component, check]) => {
    totalComponents++
    if (check.status === 'UP') {
      healthyComponents++
    } else if (check.status === 'WARNING') {
      healthyComponents += 0.7
    } else if (check.status === 'DEGRADED') {
      healthyComponents += 0.3
    }
    
    // Collect issues
    if (check.status !== 'UP' && check.message) {
      summary.issues.push(`${component}: ${check.message}`)
    }
  })

  summary.healthScore = Math.round((healthyComponents / totalComponents) * 100)

  return res.status(200).json(
    ApiResponse.success({
      summary,
      details: healthData
    }, 'Health summary generated')
  )
})

export const adminHealthController = {
  getSystemHealth,
  getServiceStatus,
  getSystemInfo,
  getDatabaseHealth,
  getResourcesHealth,
  getHealthSummary
} 