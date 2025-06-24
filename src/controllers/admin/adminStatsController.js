import { adminStatsService } from '~/services/adminStatsService'
import ApiResponse from '~/utils/ApiResponse'
import { catchAsync } from '~/utils/catchAsync'
import { logger } from '~/utils/logger'

/**
 * Admin Statistics Controller
 * Provides endpoints for admin dashboard statistics
 */

/**
 * Get overview statistics for admin dashboard
 * GET /admin/stats/overview
 */
const getOverviewStats = catchAsync(async (req, res) => {
  const stats = await adminStatsService.getOverviewStats()
  
  // Check if there were any partial failures
  if (stats.metadata?.partialFailures?.length > 0) {
    logger.warn('Overview stats returned with partial failures', {
      failures: stats.metadata.partialFailures,
      endpoint: '/admin/stats/overview'
    })
    
    return res.status(200).json(
      ApiResponse.success(stats, `Admin overview statistics retrieved with some partial failures: ${stats.metadata.partialFailures.join(', ')}`)
    )
  }
  
  return res.status(200).json(
    ApiResponse.success(stats, 'Admin overview statistics retrieved successfully')
  )
})

/**
 * Get financial statistics (revenue, commission, etc.)
 * GET /admin/stats/financial
 */
const getFinancialStats = catchAsync(async (req, res) => {
  const stats = await adminStatsService.getFinancialStats()
  
  // Check data completeness
  const completeness = stats.metadata?.dataCompleteness
  if (completeness && (!completeness.revenue || !completeness.commission)) {
    const missingData = []
    if (!completeness.revenue) missingData.push('revenue')
    if (!completeness.commission) missingData.push('commission')
    
    logger.warn('Financial stats returned with incomplete data', {
      missingData,
      endpoint: '/admin/stats/financial'
    })
    
    return res.status(200).json(
      ApiResponse.success(stats, `Financial statistics retrieved with some data unavailable: ${missingData.join(', ')}`)
    )
  }
  
  return res.status(200).json(
    ApiResponse.success(stats, 'Financial statistics retrieved successfully')
  )
})

/**
 * Get user statistics breakdown
 * GET /admin/stats/users
 */
const getUserStats = catchAsync(async (req, res) => {
  const stats = await adminStatsService.getUserStats()
  
  return res.status(200).json(
    ApiResponse.success(stats, 'User statistics retrieved successfully')
  )
})

/**
 * Get company statistics breakdown
 * GET /admin/stats/companies
 */
const getCompanyStats = catchAsync(async (req, res) => {
  const stats = await adminStatsService.getCompanyStats()
  
  return res.status(200).json(
    ApiResponse.success(stats, 'Company statistics retrieved successfully')
  )
})

/**
 * Get vehicle statistics breakdown
 * GET /admin/stats/vehicles
 */
const getVehicleStats = catchAsync(async (req, res) => {
  const stats = await adminStatsService.getVehicleStats()
  
  return res.status(200).json(
    ApiResponse.success(stats, 'Vehicle statistics retrieved successfully')
  )
})

/**
 * Get trip statistics breakdown
 * GET /admin/stats/trips
 */
const getTripStats = catchAsync(async (req, res) => {
  const stats = await adminStatsService.getTripStats()
  
  return res.status(200).json(
    ApiResponse.success(stats, 'Trip statistics retrieved successfully')
  )
})

/**
 * Get ticket statistics breakdown
 * GET /admin/stats/tickets
 */
const getTicketStats = catchAsync(async (req, res) => {
  const stats = await adminStatsService.getTicketStats()
  
  return res.status(200).json(
    ApiResponse.success(stats, 'Ticket statistics retrieved successfully')
  )
})

/**
 * Get ticket request statistics breakdown
 * GET /admin/stats/requests
 */
const getTicketRequestStats = catchAsync(async (req, res) => {
  const stats = await adminStatsService.getTicketRequestStats()
  
  return res.status(200).json(
    ApiResponse.success(stats, 'Ticket request statistics retrieved successfully')
  )
})

/**
 * Get detailed revenue breakdown
 * GET /admin/stats/revenue-breakdown
 */
const getRevenueBreakdown = catchAsync(async (req, res) => {
  const breakdown = await adminStatsService.getTicketRevenueBreakdown()
  
  return res.status(200).json(
    ApiResponse.success(breakdown, 'Revenue breakdown retrieved successfully')
  )
})

/**
 * Get commission rates by role
 * GET /admin/stats/commission-rates
 */
const getCommissionRates = catchAsync(async (req, res) => {
  const rates = await adminStatsService.getCommissionRates()
  
  return res.status(200).json(
    ApiResponse.success(rates, 'Commission rates retrieved successfully')
  )
})

/**
 * Get comprehensive dashboard data (overview + financial)
 * GET /admin/stats/dashboard
 */
const getDashboardStats = catchAsync(async (req, res) => {
  try {
    const [overview, financial] = await Promise.allSettled([
      adminStatsService.getOverviewStats(),
      adminStatsService.getFinancialStats()
    ])
    
    const dashboardData = {
      metadata: {
        lastUpdated: new Date(),
        dataStatus: {
          overview: overview.status === 'fulfilled',
          financial: financial.status === 'fulfilled'
        }
      }
    }
    
    // Handle overview data
    if (overview.status === 'fulfilled') {
      dashboardData.overview = overview.value
    } else {
      dashboardData.overview = { error: 'Failed to retrieve overview statistics' }
      logger.error('Failed to retrieve overview for dashboard', {
        error: overview.reason,
        endpoint: '/admin/stats/dashboard'
      })
    }
    
    // Handle financial data
    if (financial.status === 'fulfilled') {
      dashboardData.financial = financial.value
    } else {
      dashboardData.financial = { error: 'Failed to retrieve financial statistics' }
      logger.error('Failed to retrieve financial stats for dashboard', {
        error: financial.reason,
        endpoint: '/admin/stats/dashboard'
      })
    }
    
    // Determine response message based on data completeness
    const hasErrors = !dashboardData.metadata.dataStatus.overview || !dashboardData.metadata.dataStatus.financial
    
    if (hasErrors) {
      const failedSections = []
      if (!dashboardData.metadata.dataStatus.overview) failedSections.push('overview')
      if (!dashboardData.metadata.dataStatus.financial) failedSections.push('financial')
      
      return res.status(200).json(
        ApiResponse.success(dashboardData, `Dashboard statistics retrieved with some failures: ${failedSections.join(', ')}`)
      )
    }
    
    return res.status(200).json(
      ApiResponse.success(dashboardData, 'Dashboard statistics retrieved successfully')
    )
  } catch (error) {
    logger.error('Critical error in dashboard stats', {
      error: error.message,
      stack: error.stack,
      endpoint: '/admin/stats/dashboard'
    })
    
    throw error // Let catchAsync handle the final error response
  }
})

export const adminStatsController = {
  getOverviewStats,
  getFinancialStats,
  getUserStats,
  getCompanyStats,
  getVehicleStats,
  getTripStats,
  getTicketStats,
  getTicketRequestStats,
  getRevenueBreakdown,
  getCommissionRates,
  getDashboardStats
} 