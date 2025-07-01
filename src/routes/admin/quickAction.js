import express from 'express'
import { quickActionController } from '~/controllers/quickActionController'
import { adminAuth } from '~/middlewares/adminMiddleware'
import { quickActionValidation } from '~/validations/quickActionValidation'

const Router = express.Router()

// Get revenue (Admin only)
Router.route('/').get(adminAuth, quickActionController.getAllQuickAction)

Router.route('/:quickActionId').patch(
  adminAuth,
  quickActionValidation.quickActionUpdate,
  quickActionController.updateQuickAction
)

export const adminQuickActionRoutes = Router
