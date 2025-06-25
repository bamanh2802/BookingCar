import express from 'express'
import { adminUserRoleController } from '~/controllers/admin/adminUserRoleController'
import { adminAuth } from '~/middlewares/adminMiddleware'

const Router = express.Router()

// Get role statistics (must be before /:roleId routes)
Router.get('/stats', adminAuth, adminUserRoleController.getUserRoleStats)

// Get available permissions
Router.get('/permissions', adminAuth, adminUserRoleController.getAvailablePermissions)

// Get all user roles (Admin only)
Router.route('/')
  .get(adminAuth, adminUserRoleController.getUserRoles)
  .post(adminAuth, adminUserRoleController.createUserRole)

// User role management by ID
Router.route('/:roleId')
  .get(adminAuth, adminUserRoleController.getUserRoleById)
  .patch(adminAuth, adminUserRoleController.updateUserRole)
  .delete(adminAuth, adminUserRoleController.deleteUserRole)

// User role action routes
Router.patch('/:roleId/toggle-status', adminAuth, adminUserRoleController.toggleUserRoleStatus)
Router.patch('/:roleId/permissions', adminAuth, adminUserRoleController.updateRolePermissions)
Router.patch('/:roleId/inheritance', adminAuth, adminUserRoleController.setRoleInheritance)
Router.post('/:roleId/duplicate', adminAuth, adminUserRoleController.duplicateUserRole)

// Get users by role
Router.get('/:roleId/users', adminAuth, adminUserRoleController.getUsersByRole)

export const adminUserRoleRoutes = Router 