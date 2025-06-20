import express from 'express'
import { USER_ROLES } from '~/constants'
import { commissionController } from '~/controllers/commissionController'
import { authMiddleware } from '~/middlewares/authMiddleware'

const Router = express.Router()

// Chỉ admin mới được update commission với roleId
Router.route('/:roleId').patch(
  authMiddleware.authenticate,
  authMiddleware.restrictTo(USER_ROLES.ADMIN),
  commissionController.updateCommission
)

// Lấy toàn bộ danh sách commission
Router.route('/').get(
  authMiddleware.authenticate,
  authMiddleware.restrictTo(USER_ROLES.ADMIN),
  commissionController.getAllCommissionsWithRoles
)

export const commissionRoutes = Router
