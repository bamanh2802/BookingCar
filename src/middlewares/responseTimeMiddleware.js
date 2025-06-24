import logger from '~/utils/logger'

/**
 * Response Time Monitoring Middleware
 * Tracks API response times for health monitoring and performance analysis
 */

// Store response time statistics in memory
let responseTimeStats = {
  totalRequests: 0,
  totalResponseTime: 0,
  averageResponseTime: 0,
  recentRequests: [], // Store last 100 requests
  maxRecentRequests: 100,
  minResponseTime: null,
  maxResponseTime: null,
  lastUpdated: new Date()
}

/**
 * Middleware to measure and log response times
 */
const responseTimeMiddleware = (req, res, next) => {
  const startTime = Date.now()
  
  // Store start time in request for potential future use
  req.startTime = startTime

  // Override res.end to capture when response is sent
  const originalEnd = res.end
  
  res.end = function(...args) {
    const endTime = Date.now()
    const responseTime = endTime - startTime
    
    // Update statistics
    updateResponseTimeStats(req, responseTime)
    
    // Log response time for monitoring
    logger.debug('API Response Time', {
      method: req.method,
      url: req.originalUrl,
      statusCode: res.statusCode,
      responseTime: `${responseTime}ms`,
      userAgent: req.get('User-Agent'),
      ip: req.ip
    })

    // Call original end method
    originalEnd.apply(this, args)
  }

  next()
}

/**
 * Update response time statistics
 * @param {Object} req - Request object
 * @param {number} responseTime - Response time in milliseconds
 */
const updateResponseTimeStats = (req, responseTime) => {
  try {
    // Update counters
    responseTimeStats.totalRequests++
    responseTimeStats.totalResponseTime += responseTime
    responseTimeStats.averageResponseTime = Math.round(
      responseTimeStats.totalResponseTime / responseTimeStats.totalRequests
    )

    // Update min/max
    if (responseTimeStats.minResponseTime === null || responseTime < responseTimeStats.minResponseTime) {
      responseTimeStats.minResponseTime = responseTime
    }
    if (responseTimeStats.maxResponseTime === null || responseTime > responseTimeStats.maxResponseTime) {
      responseTimeStats.maxResponseTime = responseTime
    }

    // Add to recent requests (keep only last N requests)
    responseTimeStats.recentRequests.push({
      timestamp: new Date(),
      method: req.method,
      url: req.originalUrl,
      responseTime
    })

    // Remove old requests if exceeded max
    if (responseTimeStats.recentRequests.length > responseTimeStats.maxRecentRequests) {
      responseTimeStats.recentRequests.shift()
    }

    // Calculate recent average (last 10 requests)
    const recentCount = Math.min(10, responseTimeStats.recentRequests.length)
    if (recentCount > 0) {
      const recentSum = responseTimeStats.recentRequests
        .slice(-recentCount)
        .reduce((sum, req) => sum + req.responseTime, 0)
      responseTimeStats.recentAverageResponseTime = Math.round(recentSum / recentCount)
    }

    responseTimeStats.lastUpdated = new Date()

  } catch (error) {
    logger.error('Error updating response time stats', { error: error.message })
  }
}

/**
 * Get current response time statistics
 * @returns {Object} Response time statistics
 */
const getResponseTimeStats = () => {
  const stats = {
    ...responseTimeStats,
    // Don't include the full recent requests array in the health check
    recentRequestsCount: responseTimeStats.recentRequests.length,
    recentRequests: undefined
  }

  // Calculate percentiles from recent requests if we have enough data
  if (responseTimeStats.recentRequests.length >= 10) {
    const sortedTimes = responseTimeStats.recentRequests
      .map(req => req.responseTime)
      .sort((a, b) => a - b)
    
    const p50Index = Math.floor(sortedTimes.length * 0.5)
    const p90Index = Math.floor(sortedTimes.length * 0.9)
    const p95Index = Math.floor(sortedTimes.length * 0.95)

    stats.percentiles = {
      p50: sortedTimes[p50Index],
      p90: sortedTimes[p90Index],
      p95: sortedTimes[p95Index]
    }
  }

  return stats
}

/**
 * Reset response time statistics (useful for testing or maintenance)
 */
const resetResponseTimeStats = () => {
  responseTimeStats = {
    totalRequests: 0,
    totalResponseTime: 0,
    averageResponseTime: 0,
    recentRequests: [],
    maxRecentRequests: 100,
    minResponseTime: null,
    maxResponseTime: null,
    lastUpdated: new Date()
  }
  
  logger.info('Response time statistics reset')
  return true
}

/**
 * Get health status for API response times
 * @returns {Object} API response time health status
 */
const getApiHealthStatus = () => {
  const stats = getResponseTimeStats()
  
  // Determine health status based on response times
  let status = 'UP'
  let message = 'API response times are healthy'
  
  if (stats.averageResponseTime > 5000) { // > 5 seconds
    status = 'DOWN'
    message = 'API response times are critically slow'
  } else if (stats.averageResponseTime > 2000) { // > 2 seconds
    status = 'DEGRADED'
    message = 'API response times are slower than optimal'
  } else if (stats.recentAverageResponseTime > 1000) { // > 1 second recent
    status = 'WARNING'
    message = 'Recent API response times are elevated'
  }

  return {
    status,
    message,
    statistics: stats
  }
}

export {
  responseTimeMiddleware,
  getResponseTimeStats,
  resetResponseTimeStats,
  getApiHealthStatus
} 