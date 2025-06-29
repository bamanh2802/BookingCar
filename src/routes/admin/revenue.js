import express from 'express'
import { USER_ROLES } from '~/constants'
import { adminRevenueController } from '~/controllers/admin/adminRevenueController'
import { adminAuth } from '~/middlewares/adminMiddleware'
import { authMiddleware } from '~/middlewares/authMiddleware'

const Router = express.Router()

// Get revenue (Admin only)
Router.route('/').get(
  authMiddleware.authenticate,
  authMiddleware.restrictTo(USER_ROLES.ADMIN, USER_ROLES.AGENT_LV1, USER_ROLES.AGENT_LV2),
  adminRevenueController.getAllRevenues
)

Router.route('/ticket').get(adminAuth, adminRevenueController.getRevenueTicketType)

// Router.get('/agents', adminAuth, adminRevenueController.getAgentRevenues)
export const adminRevenueRoutes = Router
