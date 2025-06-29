import express from 'express'
import { adminCommissionController } from '~/controllers/admin/adminCommissionController'
import { adminAuth } from '~/middlewares/adminMiddleware'
import { commissionValidation } from '~/validations/commissionValidation'

const Router = express.Router()

// Get commission statistics (must be before /:commissionId routes)
Router.get('/stats', adminAuth, adminCommissionController.getCommissionStats)

// Calculate all commissions for a period
Router.get('/calculate', adminAuth, adminCommissionController.calculateAllCommissions)

// Get all commissions (Admin only)
Router.route('/')
  .get(adminAuth, adminCommissionController.getCommissions)
  .post(adminAuth, commissionValidation.createCommission, adminCommissionController.createCommission)

// Commission management by ID
Router.route('/:commissionId')
  .get(adminAuth, adminCommissionController.getCommissionById)
  .patch(adminAuth, commissionValidation.updateCommission, adminCommissionController.updateCommission)
  .delete(adminAuth, adminCommissionController.deleteCommission)

// Commission action routes
Router.patch('/:commissionId/approve', adminAuth, adminCommissionController.approveCommission)
Router.patch('/:commissionId/reject', adminAuth, adminCommissionController.rejectCommission)
Router.patch('/:commissionId/pay', adminAuth, adminCommissionController.payCommission)

// Get commissions by user
Router.get('/user/:userId', adminAuth, adminCommissionController.getCommissionsByUser)

export const adminCommissionRoutes = Router
