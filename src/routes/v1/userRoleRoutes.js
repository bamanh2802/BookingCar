import express from 'express'
import { PERMISSIONS } from '~/constants'
import { userRoleController } from '~/controllers/userRoleController'
import { authMiddleware } from '~/middlewares/authMiddleware'
import ApiResponse from '~/utils/ApiResponse'

const Router = express.Router()

// Route public - GET
Router.route('/').get((req, res) => {
  res.status(200).json(ApiResponse.success({ message: 'Role API' }))
})

// Lấy danh sách quyền có sẵn
Router.route('/permissions').get(
  authMiddleware.authenticate,
  authMiddleware.hasPermission(PERMISSIONS.VIEW_ROLES),
  userRoleController.getAllPermissions
)

// Lấy quyền của role cụ thể
Router.route('/:roleId/permissions').get(
  authMiddleware.authenticate,
  authMiddleware.hasPermission(PERMISSIONS.VIEW_ROLES),
  userRoleController.getRolePermissions
)

// Các route CRUD cho vai trò (admin only)
Router.route('/')
  .get(
    authMiddleware.authenticate,
    authMiddleware.hasPermission(PERMISSIONS.VIEW_ROLES),
    userRoleController.getAllRoles
  )
  .post(
    authMiddleware.authenticate,
    authMiddleware.hasPermission(PERMISSIONS.CREATE_ROLE),
    userRoleController.createRole
  )

Router.route('/:roleId')
  .get(
    authMiddleware.authenticate,
    authMiddleware.hasPermission(PERMISSIONS.VIEW_ROLES),
    userRoleController.getRoleById
  )
  .patch(
    authMiddleware.authenticate,
    authMiddleware.hasPermission(PERMISSIONS.UPDATE_ROLE),
    userRoleController.updateRole
  )
  .delete(
    authMiddleware.authenticate,
    authMiddleware.hasPermission(PERMISSIONS.DELETE_ROLE),
    userRoleController.deleteRole
  )

// Cập nhật quyền cho vai trò
Router.patch(
  '/:roleId/permissions',
  authMiddleware.authenticate,
  authMiddleware.hasPermission(PERMISSIONS.MANAGE_ROLE_PERMISSIONS),
  userRoleController.updateRolePermissions
)

// Cập nhật vai trò kế thừa
Router.patch(
  '/:roleId/inherits',
  authMiddleware.authenticate,
  authMiddleware.hasPermission(PERMISSIONS.MANAGE_ROLE_PERMISSIONS),
  userRoleController.updateRoleInherits
)

export default Router
