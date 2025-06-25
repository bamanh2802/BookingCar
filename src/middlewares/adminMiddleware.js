import { env } from '~/config/environment'
import { jwtProvider } from '~/providers/jwtProvider'
import userRepository from '~/repositories/userRepository'
import userRoleRepository from '~/repositories/userRoleRepository'
import { catchAsync } from '~/utils/catchAsync'
import { AuthenticationError } from '~/utils/errors'
import { PERMISSIONS } from '~/constants'

/**
 * Enhanced Admin Authentication Middleware
 * Specifically designed for Admin-only endpoints with robust role verification
 */
const adminAuthenticate = catchAsync(async (req, res, next) => {
  // Extract token from cookie or Authorization header
  let token = req.cookies?.accessToken

  // If not in cookie, check Authorization header
  if (!token && req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1]
  }

  // If no token found
  if (!token) {
    throw new AuthenticationError('Admin access required. Please login as Admin.')
  }

  try {
    // Verify JWT token
    const decoded = await jwtProvider.verifyToken(token, env.ACCESS_TOKEN_SECRET_KEY)

    // Get user from database with role information
    const user = await userRepository.findById(decoded._id)
    if (!user || !user.roleId) {
      throw new AuthenticationError('Admin user not found or invalid role.')
    }

    // Get user role
    const userRole = await userRoleRepository.findById(user.roleId)
    if (!userRole) {
      throw new AuthenticationError('Admin role information not found.')
    }

    // Strict Admin role check - only Admin role allowed
    if (userRole.roleName !== 'Admin') {
      throw new AuthenticationError('Access denied. Admin privileges required.')
    }

    // TODO: Add token blacklist check here when Redis is integrated
    // if (await isTokenBlacklisted(token)) {
    //   throw new AuthenticationError('Token has been invalidated. Please login again.')
    // }

    // Store user info in request object for use in controllers
    req.user = decoded
    req.userRole = userRole
    req.adminToken = token // Store token for potential invalidation

    next()
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new AuthenticationError('Admin session expired. Please login again.')
    }
    if (error.name === 'JsonWebTokenError') {
      throw new AuthenticationError('Invalid admin token. Please login again.')
    }
    
    // Re-throw custom authentication errors
    throw error
  }
})

/**
 * Enhanced Admin Permission Check
 * Checks specific permissions for Admin users
 */
const adminHasPermission = (...permissions) => {
  return catchAsync(async (req, res, next) => {
    // Must be called after adminAuthenticate
    if (!req.user || !req.userRole) {
      throw new AuthenticationError('Admin authentication required before permission check.')
    }

    // Double-check Admin role (redundant but safe)
    if (req.userRole.roleName !== 'Admin') {
      throw new AuthenticationError('Admin role required for this operation.')
    }

    // Get all permissions (including inherited ones)
    let allPermissions = [...req.userRole.permissions]

    // Add permissions from inherited roles if any
    if (req.userRole.inherits && req.userRole.inherits.length > 0) {
      const inheritRoles = await userRoleRepository.model.find({
        _id: { $in: req.userRole.inherits }
      })

      for (const role of inheritRoles) {
        allPermissions = [...allPermissions, ...role.permissions]
      }
    }

    // Remove duplicates
    allPermissions = [...new Set(allPermissions)]

    // Check if Admin has all required permissions
    const hasAllPermissions = permissions.every((permission) => allPermissions.includes(permission))

    if (!hasAllPermissions) {
      throw new AuthenticationError(`Admin lacks required permissions: ${permissions.join(', ')}`)
    }

    // Store permissions for potential use in controllers
    req.adminPermissions = allPermissions

    next()
  })
}

/**
 * Composite middleware for basic admin authentication
 * Use this for endpoints that only need Admin role verification
 */
export const adminAuth = [adminAuthenticate]

/**
 * Enhanced admin middlewares for specific admin operations
 */
// User management permissions
export const adminUserManagement = [adminAuthenticate, adminHasPermission(PERMISSIONS.VIEW_USERS, PERMISSIONS.CREATE_USER, PERMISSIONS.UPDATE_USER, PERMISSIONS.DELETE_USER)]
export const adminUserCreate = [adminAuthenticate, adminHasPermission(PERMISSIONS.CREATE_USER)]
export const adminUserUpdate = [adminAuthenticate, adminHasPermission(PERMISSIONS.UPDATE_USER)]
export const adminUserDelete = [adminAuthenticate, adminHasPermission(PERMISSIONS.DELETE_USER)]
export const adminUserView = [adminAuthenticate, adminHasPermission(PERMISSIONS.VIEW_USERS)]

// Role management permissions
export const adminRoleView = [adminAuthenticate, adminHasPermission(PERMISSIONS.VIEW_ROLES)]
export const adminRoleCreate = [adminAuthenticate, adminHasPermission(PERMISSIONS.CREATE_ROLE)]
export const adminRoleUpdate = [adminAuthenticate, adminHasPermission(PERMISSIONS.UPDATE_ROLE)]
export const adminRoleDelete = [adminAuthenticate, adminHasPermission(PERMISSIONS.DELETE_ROLE)]
export const adminRolePermissions = [adminAuthenticate, adminHasPermission(PERMISSIONS.MANAGE_ROLE_PERMISSIONS)]

// Vehicle management permissions
export const adminVehicleView = [adminAuthenticate, adminHasPermission(PERMISSIONS.VIEW_VEHICLES)]
export const adminVehicleCreate = [adminAuthenticate, adminHasPermission(PERMISSIONS.CREATE_VEHICLE)]
export const adminVehicleUpdate = [adminAuthenticate, adminHasPermission(PERMISSIONS.UPDATE_VEHICLE)]
export const adminVehicleDelete = [adminAuthenticate, adminHasPermission(PERMISSIONS.DELETE_VEHICLE)]

// Trip management permissions
export const adminTripView = [adminAuthenticate, adminHasPermission(PERMISSIONS.VIEW_TRIPS)]
export const adminTripCreate = [adminAuthenticate, adminHasPermission(PERMISSIONS.CREATE_TRIP)]
export const adminTripUpdate = [adminAuthenticate, adminHasPermission(PERMISSIONS.UPDATE_TRIP)]
export const adminTripDelete = [adminAuthenticate, adminHasPermission(PERMISSIONS.DELETE_TRIP)]

// Ticket management permissions
export const adminTicketView = [adminAuthenticate, adminHasPermission(PERMISSIONS.VIEW_TICKETS)]
export const adminTicketCreate = [adminAuthenticate, adminHasPermission(PERMISSIONS.CREATE_TICKET)]
export const adminTicketUpdate = [adminAuthenticate, adminHasPermission(PERMISSIONS.UPDATE_TICKET)]
export const adminTicketDelete = [adminAuthenticate, adminHasPermission(PERMISSIONS.DELETE_TICKET)]

// Ticket request management permissions
export const adminTicketRequestView = [adminAuthenticate, adminHasPermission(PERMISSIONS.VIEW_TICKET_REQUESTS)]
export const adminTicketRequestCreate = [adminAuthenticate, adminHasPermission(PERMISSIONS.CREATE_TICKET_REQUEST)]
export const adminTicketRequestUpdate = [adminAuthenticate, adminHasPermission(PERMISSIONS.UPDATE_TICKET_REQUEST)]
export const adminTicketRequestDelete = [adminAuthenticate, adminHasPermission(PERMISSIONS.DELETE_TICKET_REQUEST)]

// Bank account management permissions
export const adminBankAccountView = [adminAuthenticate, adminHasPermission(PERMISSIONS.VIEW_BANK_ACCOUNT)]
export const adminBankAccountCreate = [adminAuthenticate, adminHasPermission(PERMISSIONS.CREATE_BANK_ACCOUNT)]
export const adminBankAccountUpdate = [adminAuthenticate, adminHasPermission(PERMISSIONS.UPDATE_BANK_ACCOUNT)]
export const adminBankAccountDelete = [adminAuthenticate, adminHasPermission(PERMISSIONS.DELETE_BANK_ACCOUNT)]
export const adminBankAccountVerify = [adminAuthenticate, adminHasPermission(PERMISSIONS.VERIFY_BANK_ACCOUNT)]

// For admin-only endpoints (authentication only, no specific permissions)
export const adminOnly = adminAuth

// Export individual functions for flexibility
export { adminAuthenticate, adminHasPermission }
