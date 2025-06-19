import express from 'express'
import { adminAuthController } from '~/controllers/admin/adminAuthController'
import { authMiddleware } from '~/middlewares/authMiddleware'
import { userValidation } from '~/validations/userValidation'
import ApiResponse from '~/utils/ApiResponse'

const Router = express.Router()

// Route test admin auth
Router.route('/').get((req, res) => {
  res.status(200).json(ApiResponse.success({ message: 'Admin Auth API' }))
})

// Admin login
Router.route('/login').post(userValidation.login, adminAuthController.login)

// Admin refresh token
Router.route('/refresh-token').post(adminAuthController.refreshToken)

// Admin profile management
Router.route('/profile')
  .get(authMiddleware.authenticate, adminAuthController.getProfile)
  .patch(authMiddleware.authenticate, userValidation.updateProfile, adminAuthController.updateProfile)

export const adminAuthRoutes = Router 