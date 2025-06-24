import express from 'express'
import { adminStatsController } from '~/controllers/admin/adminStatsController'
import { adminAuth } from '~/middlewares/adminMiddleware'
import ApiResponse from '~/utils/ApiResponse'

const Router = express.Router()

// Route test admin stats API
Router.route('/').get((req, res) => {
  res.status(200).json(ApiResponse.success({ message: 'Admin Statistics API' }))
})

// Overview and dashboard statistics
Router.route('/overview')
  .get(adminAuth, adminStatsController.getOverviewStats)

Router.route('/dashboard')
  .get(adminAuth, adminStatsController.getDashboardStats)

Router.route('/financial')
  .get(adminAuth, adminStatsController.getFinancialStats)

// Individual entity statistics
Router.route('/users')
  .get(adminAuth, adminStatsController.getUserStats)

Router.route('/companies')
  .get(adminAuth, adminStatsController.getCompanyStats)

Router.route('/vehicles')
  .get(adminAuth, adminStatsController.getVehicleStats)

Router.route('/trips')
  .get(adminAuth, adminStatsController.getTripStats)

Router.route('/tickets')
  .get(adminAuth, adminStatsController.getTicketStats)

Router.route('/requests')
  .get(adminAuth, adminStatsController.getTicketRequestStats)

// Detailed breakdowns
Router.route('/revenue-breakdown')
  .get(adminAuth, adminStatsController.getRevenueBreakdown)

Router.route('/commission-rates')
  .get(adminAuth, adminStatsController.getCommissionRates)

export const adminStatsRoutes = Router 