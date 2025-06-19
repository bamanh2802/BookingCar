import express from 'express'
import { PERMISSIONS } from '~/constants'
import { userController } from '~/controllers/userController'
import { authMiddleware } from '~/middlewares/authMiddleware'
import ApiResponse from '~/utils/ApiResponse'
import { userValidation } from '~/validations/userValidation'

const Router = express.Router()

// Route public - GET
Router.route('/').get((req, res) => {
  res.status(200).json(ApiResponse.success({ message: 'User API' }))
})

// Route đăng ký và đăng nhập - không cần xác thực
Router.route('/register').post(userValidation.register, userController.register)
Router.route('/login').post(userValidation.login, userController.login)
Router.route('/refresh-token').post(userController.refreshToken)

// Các routes yêu cầu xác thực
Router.route('/profile')
  .get(authMiddleware.authenticate, userController.getProfile)
  .patch(authMiddleware.authenticate, userValidation.updateProfile, userController.updateProfile)

export const userRoutes = Router
