import express from 'express'
import { adminUserController } from '~/controllers/admin/adminUserController'
import { 
  adminUserView, 
  adminUserCreate, 
  adminUserUpdate, 
  adminUserDelete 
} from '~/middlewares/adminMiddleware'
import { userValidation } from '~/validations/userValidation'

const Router = express.Router()

// Get all users (Admin only)
Router.route('/')
  .get(adminUserView, adminUserController.getUsers)
  .post(adminUserCreate, userValidation.createUser, adminUserController.createUser)

// User management by ID
Router.route('/:userId')
  .get(adminUserView, adminUserController.getUserById)
  .patch(adminUserUpdate, userValidation.updateProfile, adminUserController.updateUser)
  .delete(adminUserDelete, adminUserController.deleteUser)

export const adminUserRoutes = Router
