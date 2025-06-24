import express from 'express'
import { adminAuthController } from '~/controllers/admin/adminAuthController'
import { adminAuth } from '~/middlewares/adminMiddleware'
import { userValidation } from '~/validations/userValidation'
import ApiResponse from '~/utils/ApiResponse'

const Router = express.Router()

// Route test admin auth
Router.route('/').get((req, res) => {
  res.status(200).json(ApiResponse.success({ message: 'Admin Auth API' }))
})

// Admin login - no authentication required
Router.route('/login').post(userValidation.login, adminAuthController.login)

// Admin refresh token - no authentication required (uses refresh token from cookie)
Router.route('/refresh-token').post(adminAuthController.refreshToken)

// Admin logout - requires admin authentication to ensure proper token cleanup
Router.route('/logout').post(adminAuth, adminAuthController.logout)

// Admin profile management - requires admin authentication
Router.route('/profile')
  .get(adminAuth, adminAuthController.getProfile)
  .patch(adminAuth, userValidation.updateProfile, adminAuthController.updateProfile)

export const adminAuthRoutes = Router 