import { authMiddleware } from './authMiddleware.js'
import { PERMISSIONS } from '~/constants'

/**
 * Middleware cơ bản cho admin - yêu cầu đăng nhập và quyền xem users
 */
export const adminAuth = [
  authMiddleware.authenticate,
  authMiddleware.hasPermission(PERMISSIONS.VIEW_USERS)
]

/**
 * Middleware cho admin user management - bao gồm kiểm tra quyền quản lý user
 */
export const adminUserManagement = [
  authMiddleware.authenticate,
  authMiddleware.hasPermission(PERMISSIONS.VIEW_USERS),
  authMiddleware.canManageUser
]

/**
 * Middleware cho admin user creation
 */
export const adminUserCreate = [
  authMiddleware.authenticate,
  authMiddleware.hasPermission(PERMISSIONS.CREATE_USER)
]

/**
 * Middleware cho admin user update
 */
export const adminUserUpdate = [
  authMiddleware.authenticate,
  authMiddleware.hasPermission(PERMISSIONS.UPDATE_USER),
  authMiddleware.canManageUser
]

/**
 * Middleware cho admin user delete
 */
export const adminUserDelete = [
  authMiddleware.authenticate,
  authMiddleware.hasPermission(PERMISSIONS.DELETE_USER),
  authMiddleware.canManageUser
]

/**
 * Middleware chỉ cho authentication (login, refresh token)
 */
export const adminAuthOnly = [
  // Chỉ cần authentication middleware khi cần thiết
] 