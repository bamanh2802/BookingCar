import express from 'express'
import { StatusCodes } from 'http-status-codes'
import { adminAuthRoutes } from './auth.js'
import { adminUserRoutes } from './users.js'
import { adminStatsRoutes } from './stats.js'
import adminHealthRoutes from './health.js'
import { adminCompanyRoutes } from './companies.js'
import { adminVehicleRoutes } from './vehicles.js'
import { adminTripRoutes } from './trips.js'
import { adminTicketRoutes } from './tickets.js'
import { adminTicketRequestRoutes } from './ticket-requests.js'
import { adminCommissionRoutes } from './commissions.js'
import { adminBankAccountRoutes } from './bank-accounts.js'
import { adminUserRoleRoutes } from './user-roles.js'
import ApiResponse from '~/utils/ApiResponse'
import { adminRevenueRoutes } from './revenue.js'

const Router = express.Router()

// Admin test route
Router.get('/', (req, res) => {
  res.status(StatusCodes.OK).json(ApiResponse.success({ message: 'Admin API v1' }))
})

// Admin routes
Router.use('/auth', adminAuthRoutes)
Router.use('/users', adminUserRoutes)
Router.use('/stats', adminStatsRoutes)
Router.use('/health', adminHealthRoutes)
Router.use('/companies', adminCompanyRoutes)
Router.use('/vehicles', adminVehicleRoutes)
Router.use('/trips', adminTripRoutes)
Router.use('/tickets', adminTicketRoutes)
Router.use('/ticket-requests', adminTicketRequestRoutes)
Router.use('/commissions', adminCommissionRoutes)
Router.use('/bank-accounts', adminBankAccountRoutes)
Router.use('/user-roles', adminUserRoleRoutes)
Router.use('/revenue', adminRevenueRoutes)

export const adminRoutes = Router
