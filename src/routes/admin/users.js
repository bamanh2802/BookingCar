import express from 'express'
import { adminUserController } from '~/controllers/admin/adminUserController'
import {
  adminAuth,
  adminUserCreate,
  adminUserUpdate,
  adminUserManagement,
  adminUserDelete
} from '~/middlewares/adminMiddleware'
import { userValidation } from '~/validations/userValidation'

const Router = express.Router()

// Lấy danh sách người dùng
Router.route('/')
  .get(...adminAuth, adminUserController.getUsers)
  .post(...adminUserCreate, userValidation.createUser, adminUserController.createUser)

// Alternative endpoints
Router.route('/list').get(...adminAuth, adminUserController.getUsers)

Router.route('/create').post(...adminUserCreate, userValidation.createUser, adminUserController.createUser)

// Quản lý người dùng cụ thể
Router.route('/:userId')
  .get(...adminUserManagement, adminUserController.getUserById)
  .patch(...adminUserUpdate, userValidation.updateProfile, adminUserController.updateUser)
  .delete(...adminUserDelete, adminUserController.deleteUser)

export const adminUserRoutes = Router
