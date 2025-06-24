import express from 'express'
import { StatusCodes } from 'http-status-codes'
import { adminAuthRoutes } from './auth.js'
import { adminUserRoutes } from './users.js'
import { adminStatsRoutes } from './stats.js'
import adminHealthRoutes from './health.js'
import ApiResponse from '~/utils/ApiResponse'

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

export const adminRoutes = Router 