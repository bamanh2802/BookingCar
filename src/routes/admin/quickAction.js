import express from 'express'
import { USER_ROLES } from '~/constants'
import { quickActionController } from '~/controllers/quickActionController'
import { adminAuth } from '~/middlewares/adminMiddleware'
import { authMiddleware } from '~/middlewares/authMiddleware'
import { quickActionValidation } from '~/validations/quickActionValidation'

const Router = express.Router()

// Get revenue (Admin only)
Router.route('/').get(authMiddleware.restrictTo(USER_ROLES.ADMIN, USER_ROLES.AGENT_LV1, USER_ROLES.AGENT_LV2), quickActionController.getAllQuickAction)

Router.route('/:quickActionId').patch(
  adminAuth,
  quickActionValidation.quickActionUpdate,
  quickActionController.updateQuickAction
)

export const adminQuickActionRoutes = Router
