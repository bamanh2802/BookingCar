import { userModel } from '~/models/userModel'
import { carCompanyModel } from '~/models/carCompanyModel'
import { vehicleModel } from '~/models/vehicleModel'
import { tripModel } from '~/models/tripModel'
import { ticketModel } from '~/models/ticketModel'
import { ticketRequestModel } from '~/models/ticketRequestModel'
import { commissionModel } from '~/models/commissionModel'
import userRoleRepository from '~/repositories/userRoleRepository'
import { logger } from '~/utils/logger'

/**
 * Admin Statistics Service
 * Provides aggregation pipelines and methods for admin dashboard statistics
 */

/**
 * Utility function to handle database aggregation errors
 * @param {Function} aggregationFn - The aggregation function to execute
 * @param {String} operationName - Name of the operation for logging
 * @returns {Promise} Result or throws error
 */
const safeAggregation = async (aggregationFn, operationName) => {
  try {
    const result = await aggregationFn()
    return result
  } catch (error) {
    logger.error(`Error in ${operationName}:`, {
      error: error.message,
      stack: error.stack,
      operation: operationName
    })
    throw new Error(`Failed to retrieve ${operationName}: ${error.message}`)
  }
}

/**
 * Get overview statistics (counts and basic metrics)
 */
const getOverviewStats = async () => {
  try {
    const [
      userStats,
      companyStats,
      vehicleStats,
      tripStats,
      ticketStats,
      requestStats
    ] = await Promise.allSettled([
      getUserStats(),
      getCompanyStats(), 
      getVehicleStats(),
      getTripStats(),
      getTicketStats(),
      getTicketRequestStats()
    ])

    // Check for any failed operations
    const failures = []
    const results = {}

    if (userStats.status === 'fulfilled') {
      results.users = userStats.value
    } else {
      failures.push('users')
      results.users = { error: 'Failed to retrieve user statistics' }
    }

    if (companyStats.status === 'fulfilled') {
      results.companies = companyStats.value
    } else {
      failures.push('companies')
      results.companies = { error: 'Failed to retrieve company statistics' }
    }

    if (vehicleStats.status === 'fulfilled') {
      results.vehicles = vehicleStats.value
    } else {
      failures.push('vehicles')
      results.vehicles = { error: 'Failed to retrieve vehicle statistics' }
    }

    if (tripStats.status === 'fulfilled') {
      results.trips = tripStats.value
    } else {
      failures.push('trips')
      results.trips = { error: 'Failed to retrieve trip statistics' }
    }

    if (ticketStats.status === 'fulfilled') {
      results.tickets = ticketStats.value
    } else {
      failures.push('tickets')
      results.tickets = { error: 'Failed to retrieve ticket statistics' }
    }

    if (requestStats.status === 'fulfilled') {
      results.requests = requestStats.value
    } else {
      failures.push('requests')
      results.requests = { error: 'Failed to retrieve request statistics' }
    }

    const response = {
      ...results,
      metadata: {
        lastUpdated: new Date(),
        partialFailures: failures,
        isComplete: failures.length === 0
      }
    }

    if (failures.length > 0) {
      logger.warn(`Partial failure in overview stats`, { failures })
    }

    return response
  } catch (error) {
    logger.error('Critical error in getOverviewStats:', {
      error: error.message,
      stack: error.stack
    })
    throw new Error('Failed to retrieve overview statistics')
  }
}

/**
 * User statistics aggregation
 */
const getUserStats = async () => {
  return safeAggregation(async () => {
    // Get role mapping for user statistics
    const roles = await userRoleRepository.model.find({}, { roleName: 1 }).lean()
    const roleMap = roles.reduce((acc, role) => {
      acc[role._id.toString()] = role.roleName
      return acc
    }, {})

    const pipeline = [
      {
        $group: {
          _id: '$roleId',
          count: { $sum: 1 },
          totalAmount: { $sum: '$amount' },
          avgAmount: { $avg: '$amount' }
        }
      },
      {
        $project: {
          roleId: '$_id',
          count: 1,
          totalAmount: 1,
          avgAmount: { $round: ['$avgAmount', 2] },
          _id: 0
        }
      }
    ]

    const result = await userModel.aggregate(pipeline)
    
    // Map role IDs to role names and get totals
    const usersByRole = {}
    let totalUsers = 0
    let totalUserAmount = 0

    result.forEach(item => {
      const roleName = roleMap[item.roleId?.toString()] || 'Unknown'
      usersByRole[roleName] = {
        count: item.count,
        totalAmount: item.totalAmount || 0,
        avgAmount: item.avgAmount || 0
      }
      totalUsers += item.count
      totalUserAmount += item.totalAmount || 0
    })

    return {
      summary: {
        total: totalUsers,
        totalAmount: totalUserAmount,
        avgAmount: totalUsers > 0 ? Math.round((totalUserAmount / totalUsers) * 100) / 100 : 0
      },
      breakdown: {
        byRole: usersByRole
      },
      metadata: {
        generatedAt: new Date(),
        totalRoles: Object.keys(usersByRole).length
      }
    }
  }, 'user statistics')
}

/**
 * Company statistics aggregation
 */
const getCompanyStats = async () => {
  return safeAggregation(async () => {
    const pipeline = [
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 },
          totalSeats: { $sum: '$totalSeats' },
          avgSeats: { $avg: '$totalSeats' }
        }
      },
      {
        $project: {
          type: '$_id',
          count: 1,
          totalSeats: 1,
          avgSeats: { $round: ['$avgSeats', 0] },
          _id: 0
        }
      }
    ]

    const result = await carCompanyModel.aggregate(pipeline)
    
    let total = 0
    let totalSeatsCapacity = 0
    const byType = {}

    result.forEach(item => {
      byType[item.type] = {
        count: item.count,
        totalSeats: item.totalSeats,
        avgSeats: item.avgSeats
      }
      total += item.count
      totalSeatsCapacity += item.totalSeats
    })

    return {
      summary: {
        total,
        totalSeatsCapacity,
        avgSeatsPerCompany: total > 0 ? Math.round(totalSeatsCapacity / total) : 0
      },
      breakdown: {
        byType
      },
      metadata: {
        generatedAt: new Date(),
        companyTypes: Object.keys(byType).length
      }
    }
  }, 'company statistics')
}

/**
 * Vehicle statistics aggregation  
 */
const getVehicleStats = async () => {
  return safeAggregation(async () => {
    const pipeline = [
      {
        $group: {
          _id: {
            status: '$status',
            type: '$specifications.type'
          },
          count: { $sum: 1 },
          totalSeats: { $sum: '$totalSeats' },
          avgSeats: { $avg: '$totalSeats' }
        }
      },
      {
        $group: {
          _id: '$_id.status',
          count: { $sum: '$count' },
          totalSeats: { $sum: '$totalSeats' },
          avgSeats: { $avg: '$avgSeats' },
          byType: {
            $push: {
              type: '$_id.type',
              count: '$count',
              totalSeats: '$totalSeats',
              avgSeats: { $round: ['$avgSeats', 0] }
            }
          }
        }
      },
      {
        $project: {
          status: '$_id',
          count: 1,
          totalSeats: 1,
          avgSeats: { $round: ['$avgSeats', 0] },
          byType: 1,
          _id: 0
        }
      }
    ]

    const result = await vehicleModel.aggregate(pipeline)
    
    let total = 0
    let totalSeatsCapacity = 0
    const byStatus = {}

    result.forEach(item => {
      const types = {}
      item.byType.forEach(typeData => {
        types[typeData.type] = {
          count: typeData.count,
          totalSeats: typeData.totalSeats,
          avgSeats: typeData.avgSeats
        }
      })

      byStatus[item.status] = {
        count: item.count,
        totalSeats: item.totalSeats,
        avgSeats: item.avgSeats,
        byType: types
      }
      total += item.count
      totalSeatsCapacity += item.totalSeats
    })

    return {
      summary: {
        total,
        totalSeatsCapacity,
        avgSeatsPerVehicle: total > 0 ? Math.round(totalSeatsCapacity / total) : 0
      },
      breakdown: {
        byStatus
      },
      metadata: {
        generatedAt: new Date(),
        vehicleStatuses: Object.keys(byStatus).length
      }
    }
  }, 'vehicle statistics')
}

/**
 * Trip statistics aggregation
 */
const getTripStats = async () => {
  return safeAggregation(async () => {
    const pipeline = [
      {
        $group: {
          _id: {
            status: '$status',
            type: '$type'
          },
          count: { $sum: 1 },
          totalRevenue: { $sum: { $multiply: ['$price', { $subtract: ['$totalSeats', '$availableSeats'] }] } },
          totalSeats: { $sum: '$totalSeats' },
          bookedSeats: { $sum: { $subtract: ['$totalSeats', '$availableSeats'] } },
          avgPrice: { $avg: '$price' }
        }
      },
      {
        $group: {
          _id: '$_id.status',
          count: { $sum: '$count' },
          totalRevenue: { $sum: '$totalRevenue' },
          totalSeats: { $sum: '$totalSeats' },
          bookedSeats: { $sum: '$bookedSeats' },
          avgPrice: { $avg: '$avgPrice' },
          byType: {
            $push: {
              type: '$_id.type',
              count: '$count',
              revenue: '$totalRevenue',
              seats: '$totalSeats',
              bookedSeats: '$bookedSeats',
              avgPrice: { $round: ['$avgPrice', 2] }
            }
          }
        }
      },
      {
        $project: {
          status: '$_id',
          count: 1,
          totalRevenue: 1,
          totalSeats: 1,
          bookedSeats: 1,
          avgPrice: { $round: ['$avgPrice', 2] },
          occupancyRate: {
            $cond: {
              if: { $gt: ['$totalSeats', 0] },
              then: { $round: [{ $multiply: [{ $divide: ['$bookedSeats', '$totalSeats'] }, 100] }, 2] },
              else: 0
            }
          },
          byType: 1,
          _id: 0
        }
      }
    ]

    const result = await tripModel.aggregate(pipeline)
    
    let total = 0
    let totalRevenue = 0
    let totalSeats = 0
    let totalBookedSeats = 0
    const byStatus = {}

    result.forEach(item => {
      const types = {}
      item.byType.forEach(typeData => {
        types[typeData.type] = {
          count: typeData.count,
          revenue: typeData.revenue,
          seats: typeData.seats,
          bookedSeats: typeData.bookedSeats,
          avgPrice: typeData.avgPrice,
          occupancyRate: typeData.seats > 0 ? Math.round((typeData.bookedSeats / typeData.seats * 100) * 100) / 100 : 0
        }
      })

      byStatus[item.status] = {
        count: item.count,
        revenue: item.totalRevenue,
        seats: item.totalSeats,
        bookedSeats: item.bookedSeats,
        avgPrice: item.avgPrice,
        occupancyRate: item.occupancyRate,
        byType: types
      }
      total += item.count
      totalRevenue += item.totalRevenue
      totalSeats += item.totalSeats
      totalBookedSeats += item.bookedSeats
    })

    return {
      summary: {
        total,
        totalRevenue,
        totalSeats,
        totalBookedSeats,
        overallOccupancyRate: totalSeats > 0 ? Math.round((totalBookedSeats / totalSeats * 100) * 100) / 100 : 0,
        avgRevenuePerTrip: total > 0 ? Math.round((totalRevenue / total) * 100) / 100 : 0
      },
      breakdown: {
        byStatus
      },
      metadata: {
        generatedAt: new Date(),
        tripStatuses: Object.keys(byStatus).length
      }
    }
  }, 'trip statistics')
}

/**
 * Ticket statistics aggregation
 */
const getTicketStats = async () => {
  return safeAggregation(async () => {
    const pipeline = [
      {
        $group: {
          _id: {
            status: '$status',
            type: '$type'
          },
          count: { $sum: 1 },
          totalRevenue: { $sum: '$price' },
          avgPrice: { $avg: '$price' },
          commissionPaidCount: {
            $sum: { $cond: ['$commissionPaid', 1, 0] }
          },
          commissionUnpaidCount: {
            $sum: { $cond: ['$commissionPaid', 0, 1] }
          }
        }
      },
      {
        $group: {
          _id: '$_id.status',
          count: { $sum: '$count' },
          totalRevenue: { $sum: '$totalRevenue' },
          avgPrice: { $avg: '$avgPrice' },
          commissionPaidCount: { $sum: '$commissionPaidCount' },
          commissionUnpaidCount: { $sum: '$commissionUnpaidCount' },
          byType: {
            $push: {
              type: '$_id.type',
              count: '$count',
              revenue: '$totalRevenue',
              avgPrice: { $round: ['$avgPrice', 2] },
              commissionPaid: '$commissionPaidCount',
              commissionUnpaid: '$commissionUnpaidCount'
            }
          }
        }
      },
      {
        $project: {
          status: '$_id',
          count: 1,
          totalRevenue: 1,
          avgPrice: { $round: ['$avgPrice', 2] },
          commissionPaidCount: 1,
          commissionUnpaidCount: 1,
          byType: 1,
          _id: 0
        }
      }
    ]

    const result = await ticketModel.aggregate(pipeline)
    
    let total = 0
    let totalRevenue = 0
    let totalCommissionPaid = 0
    let totalCommissionUnpaid = 0
    const byStatus = {}

    result.forEach(item => {
      const types = {}
      item.byType.forEach(typeData => {
        types[typeData.type] = {
          count: typeData.count,
          revenue: typeData.revenue,
          avgPrice: typeData.avgPrice,
          commissionPaid: typeData.commissionPaid,
          commissionUnpaid: typeData.commissionUnpaid,
          commissionRate: typeData.count > 0 ? Math.round((typeData.commissionPaid / typeData.count * 100) * 100) / 100 : 0
        }
      })

      byStatus[item.status] = {
        count: item.count,
        revenue: item.totalRevenue,
        avgPrice: item.avgPrice,
        commissionPaid: item.commissionPaidCount,
        commissionUnpaid: item.commissionUnpaidCount,
        commissionRate: item.count > 0 ? Math.round((item.commissionPaidCount / item.count * 100) * 100) / 100 : 0,
        byType: types
      }
      total += item.count
      totalRevenue += item.totalRevenue
      totalCommissionPaid += item.commissionPaidCount
      totalCommissionUnpaid += item.commissionUnpaidCount
    })

    return {
      summary: {
        total,
        totalRevenue,
        avgPrice: total > 0 ? Math.round((totalRevenue / total) * 100) / 100 : 0,
        totalCommissionPaid,
        totalCommissionUnpaid,
        overallCommissionRate: total > 0 ? Math.round((totalCommissionPaid / total * 100) * 100) / 100 : 0
      },
      breakdown: {
        byStatus
      },
      metadata: {
        generatedAt: new Date(),
        ticketStatuses: Object.keys(byStatus).length
      }
    }
  }, 'ticket statistics')
}

/**
 * Ticket Request statistics aggregation
 */
const getTicketRequestStats = async () => {
  return safeAggregation(async () => {
    const pipeline = [
      {
        $group: {
          _id: {
            status: '$status',
            titleRequest: '$titleRequest'
          },
          count: { $sum: 1 },
          totalAmount: { $sum: { $ifNull: ['$amount', '$price'] } },
          avgAmount: { $avg: { $ifNull: ['$amount', '$price'] } }
        }
      },
      {
        $group: {
          _id: '$_id.status',
          count: { $sum: '$count' },
          totalAmount: { $sum: '$totalAmount' },
          avgAmount: { $avg: '$avgAmount' },
          byType: {
            $push: {
              type: '$_id.titleRequest',
              count: '$count',
              amount: '$totalAmount',
              avgAmount: { $round: ['$avgAmount', 2] }
            }
          }
        }
      },
      {
        $project: {
          status: '$_id',
          count: 1,
          totalAmount: 1,
          avgAmount: { $round: ['$avgAmount', 2] },
          byType: 1,
          _id: 0
        }
      }
    ]

    const result = await ticketRequestModel.aggregate(pipeline)
    
    let total = 0
    let totalAmount = 0
    const byStatus = {}

    result.forEach(item => {
      const types = {}
      item.byType.forEach(typeData => {
        types[typeData.type] = {
          count: typeData.count,
          amount: typeData.amount || 0,
          avgAmount: typeData.avgAmount || 0,
          percentage: item.count > 0 ? Math.round((typeData.count / item.count * 100) * 100) / 100 : 0
        }
      })

      byStatus[item.status] = {
        count: item.count,
        totalAmount: item.totalAmount || 0,
        avgAmount: item.avgAmount || 0,
        byType: types
      }
      total += item.count
      totalAmount += item.totalAmount || 0
    })

    return {
      summary: {
        total,
        totalAmount,
        avgAmount: total > 0 ? Math.round((totalAmount / total) * 100) / 100 : 0
      },
      breakdown: {
        byStatus
      },
      metadata: {
        generatedAt: new Date(),
        requestStatuses: Object.keys(byStatus).length
      }
    }
  }, 'ticket request statistics')
}

/**
 * Get financial statistics (revenue, commission, etc.)
 */
const getFinancialStats = async () => {
  return safeAggregation(async () => {
    const [ticketRevenue, commissionRates] = await Promise.allSettled([
      getTicketRevenueBreakdown(),
      getCommissionRates()
    ])

    const result = {
      metadata: {
        lastUpdated: new Date(),
        dataCompleteness: {
          revenue: ticketRevenue.status === 'fulfilled',
          commission: commissionRates.status === 'fulfilled'
        }
      }
    }

    if (ticketRevenue.status === 'fulfilled') {
      result.revenue = ticketRevenue.value
    } else {
      result.revenue = { error: 'Failed to retrieve revenue breakdown' }
      logger.warn('Failed to retrieve revenue breakdown:', ticketRevenue.reason)
    }

    if (commissionRates.status === 'fulfilled') {
      result.commission = commissionRates.value
    } else {
      result.commission = { error: 'Failed to retrieve commission rates' }
      logger.warn('Failed to retrieve commission rates:', commissionRates.reason)
    }

    return result
  }, 'financial statistics')
}

/**
 * Detailed ticket revenue breakdown
 */
const getTicketRevenueBreakdown = async () => {
  const pipeline = [
    {
      $lookup: {
        from: 'trips',
        localField: 'tripId',
        foreignField: '_id',
        as: 'trip'
      }
    },
    {
      $unwind: '$trip'
    },
    {
      $lookup: {
        from: 'carcompanies',
        localField: 'trip.carCompanyId',
        foreignField: '_id',
        as: 'company'
      }
    },
    {
      $unwind: '$company'
    },
    {
      $group: {
        _id: {
          status: '$status',
          companyName: '$company.name',
          companyType: '$company.type',
          ticketType: '$type'
        },
        count: { $sum: 1 },
        revenue: { $sum: '$price' }
      }
    }
  ]

  const result = await ticketModel.aggregate(pipeline)
  
  const breakdown = {
    byCompany: {},
    byTicketType: {},
    byStatus: {}
  }

  result.forEach(item => {
    const { status, companyName, companyType, ticketType } = item._id
    
    // Group by company
    if (!breakdown.byCompany[companyName]) {
      breakdown.byCompany[companyName] = {
        type: companyType,
        revenue: 0,
        count: 0
      }
    }
    breakdown.byCompany[companyName].revenue += item.revenue
    breakdown.byCompany[companyName].count += item.count

    // Group by ticket type
    if (!breakdown.byTicketType[ticketType]) {
      breakdown.byTicketType[ticketType] = { revenue: 0, count: 0 }
    }
    breakdown.byTicketType[ticketType].revenue += item.revenue
    breakdown.byTicketType[ticketType].count += item.count

    // Group by status
    if (!breakdown.byStatus[status]) {
      breakdown.byStatus[status] = { revenue: 0, count: 0 }
    }
    breakdown.byStatus[status].revenue += item.revenue
    breakdown.byStatus[status].count += item.count
  })

  return breakdown
}

/**
 * Get commission rates
 */
const getCommissionRates = async () => {
  const pipeline = [
    {
      $lookup: {
        from: 'userroles',
        localField: 'roleId',
        foreignField: '_id',
        as: 'role'
      }
    },
    {
      $unwind: '$role'
    },
    {
      $project: {
        roleName: '$role.roleName',
        percent: 1
      }
    }
  ]

  const result = await commissionModel.aggregate(pipeline)
  
  const rates = {}
  result.forEach(item => {
    rates[item.roleName] = item.percent
  })

  return rates
}

export const adminStatsService = {
  getOverviewStats,
  getFinancialStats,
  getUserStats,
  getCompanyStats,
  getVehicleStats,
  getTripStats,
  getTicketStats,
  getTicketRequestStats,
  getTicketRevenueBreakdown,
  getCommissionRates
} 