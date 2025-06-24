import mongoose from 'mongoose'
import os from 'os'
import logger from '~/utils/logger'
import { getApiHealthStatus } from '~/middlewares/responseTimeMiddleware'

/**
 * Health Service
 * Provides various health check utilities for system monitoring
 */

/**
 * Check database connection status
 * @returns {Object} Database health status
 */
const checkDatabaseConnection = async () => {
  try {
    const connectionState = mongoose.connection.readyState
    const states = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting'
    }

    const status = states[connectionState] || 'unknown'
    const isHealthy = connectionState === 1

    // Additional database health checks
    let responseTime = null
    let error = null

    if (isHealthy) {
      try {
        // Measure database response time with a simple ping
        const startTime = Date.now()
        await mongoose.connection.db.admin().ping()
        responseTime = Date.now() - startTime
        logger.debug('Database ping successful', { responseTime })
      } catch (pingError) {
        logger.warn('Database ping failed', { error: pingError.message })
        error = pingError.message
      }
    }

    const dbInfo = {
      status: isHealthy ? 'UP' : 'DOWN',
      state: status,
      readyState: connectionState,
      host: mongoose.connection.host,
      port: mongoose.connection.port,
      name: mongoose.connection.name,
      responseTime,
      lastChecked: new Date(),
      error
    }

    logger.debug('Database health check completed', dbInfo)
    return dbInfo

  } catch (error) {
    logger.error('Database health check failed', { error: error.message })
    return {
      status: 'DOWN',
      state: 'error',
      readyState: mongoose.connection.readyState,
      error: error.message,
      lastChecked: new Date()
    }
  }
}

/**
 * Check overall system health by running all health checks
 * @returns {Object} Comprehensive health status
 */
const checkSystemHealth = async () => {
  const healthChecks = {
    database: await checkDatabaseConnection(),
    apiResponseTime: getApiHealthStatus(),
    systemResources: checkSystemResources(),
    // Will be expanded with other checks in subsequent subtasks
  }

  // Determine overall status based on individual checks
  const overallStatus = Object.values(healthChecks).every(check => 
    check.status === 'UP' || check.status === 'WARNING'
  ) ? 'UP' : Object.values(healthChecks).some(check => 
    check.status === 'DEGRADED'
  ) ? 'DEGRADED' : 'DOWN'

  return {
    status: overallStatus,
    timestamp: new Date(),
    uptime: process.uptime(),
    version: process.version,
    environment: process.env.NODE_ENV || 'development',
    checks: healthChecks
  }
}

/**
 * Get basic service status (minimal overhead)
 * @returns {Object} Basic service status
 */
const getServiceStatus = () => {
  return {
    status: 'UP',
    timestamp: new Date(),
    uptime: Math.floor(process.uptime()),
    message: 'Service is running normally'
  }
}

/**
 * Check system resource usage
 * @returns {Object} System resource health status
 */
const checkSystemResources = () => {
  try {
    // Memory information
    const totalMemory = os.totalmem()
    const freeMemory = os.freemem()
    const usedMemory = totalMemory - freeMemory
    const memoryUsagePercent = Math.round((usedMemory / totalMemory) * 100)

    // Process memory usage
    const processMemory = process.memoryUsage()
    const processMemoryMB = {
      rss: Math.round(processMemory.rss / 1024 / 1024), // Resident Set Size
      heapTotal: Math.round(processMemory.heapTotal / 1024 / 1024),
      heapUsed: Math.round(processMemory.heapUsed / 1024 / 1024),
      external: Math.round(processMemory.external / 1024 / 1024)
    }

    // CPU information
    const cpuCount = os.cpus().length
    const loadAverage = os.loadavg() // 1, 5, 15 minute load averages
    const cpuLoadPercent = Math.round((loadAverage[0] / cpuCount) * 100)

    // Uptime
    const systemUptime = os.uptime()
    const processUptime = process.uptime()

    // Determine health status
    let status = 'UP'
    let issues = []

    if (memoryUsagePercent > 90) {
      status = 'DOWN'
      issues.push('Critical memory usage')
    } else if (memoryUsagePercent > 80) {
      status = 'DEGRADED'
      issues.push('High memory usage')
    } else if (memoryUsagePercent > 70) {
      status = 'WARNING'
      issues.push('Elevated memory usage')
    }

    if (cpuLoadPercent > 90) {
      status = status === 'DOWN' ? 'DOWN' : 'DOWN'
      issues.push('Critical CPU load')
    } else if (cpuLoadPercent > 80) {
      status = status === 'DOWN' ? 'DOWN' : 'DEGRADED'
      issues.push('High CPU load')
    } else if (cpuLoadPercent > 70) {
      status = status === 'DOWN' || status === 'DEGRADED' ? status : 'WARNING'
      issues.push('Elevated CPU load')
    }

    const resourceInfo = {
      status,
      message: issues.length > 0 ? issues.join(', ') : 'System resources are healthy',
      timestamp: new Date(),
      system: {
        platform: os.platform(),
        arch: os.arch(),
        uptime: systemUptime,
        hostname: os.hostname()
      },
      memory: {
        total: Math.round(totalMemory / 1024 / 1024), // MB
        free: Math.round(freeMemory / 1024 / 1024), // MB
        used: Math.round(usedMemory / 1024 / 1024), // MB
        usagePercent: memoryUsagePercent
      },
      process: {
        uptime: processUptime,
        pid: process.pid,
        memory: processMemoryMB
      },
      cpu: {
        count: cpuCount,
        loadAverage: {
          '1min': Math.round(loadAverage[0] * 100) / 100,
          '5min': Math.round(loadAverage[1] * 100) / 100,
          '15min': Math.round(loadAverage[2] * 100) / 100
        },
        loadPercent: cpuLoadPercent
      }
    }

    logger.debug('System resource check completed', resourceInfo)
    return resourceInfo

  } catch (error) {
    logger.error('System resource check failed', { error: error.message })
    return {
      status: 'DOWN',
      message: 'Failed to check system resources',
      error: error.message,
      timestamp: new Date()
    }
  }
}

/**
 * Get detailed system information
 * @returns {Object} System information
 */
const getSystemInfo = () => {
  return {
    node: {
      version: process.version,
      platform: process.platform,
      arch: process.arch,
      uptime: process.uptime(),
      pid: process.pid
    },
    memory: process.memoryUsage(),
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date()
  }
}

export const healthService = {
  checkDatabaseConnection,
  checkSystemResources,
  checkSystemHealth,
  getServiceStatus,
  getSystemInfo
} 