import { userRoleService } from '~/services/userRoleService'
import ApiResponse from '~/utils/ApiResponse'
import { catchAsync } from '~/utils/catchAsync'

/**
 * Lấy danh sách vai trò người dùng (Admin)
 */
const getUserRoles = catchAsync(async (req, res) => {
  const { page = 1, limit = 10, search, isActive } = req.query

  const filter = {}
  
  if (search) {
    filter.$or = [
      { roleName: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } }
    ]
  }

  if (isActive !== undefined) {
    filter.isActive = isActive === 'true'
  }

  const userRoles = await userRoleService.getAllRoles(filter, parseInt(page), parseInt(limit))
  return res.status(200).json(ApiResponse.success(userRoles, 'Lấy danh sách vai trò người dùng thành công'))
})

/**
 * Tạo vai trò người dùng mới (Admin)
 */
const createUserRole = catchAsync(async (req, res) => {
  const createdUserRole = await userRoleService.createRole(req.body)
  return res.status(201).json(ApiResponse.created(createdUserRole, 'Tạo vai trò người dùng thành công'))
})

/**
 * Cập nhật thông tin vai trò người dùng (Admin)
 */
const updateUserRole = catchAsync(async (req, res) => {
  const { roleId } = req.params
  const updatedUserRole = await userRoleService.updateRole(roleId, req.body)
  return res.status(200).json(ApiResponse.success(updatedUserRole, 'Cập nhật thông tin vai trò người dùng thành công'))
})

/**
 * Lấy thông tin vai trò người dùng theo ID (Admin)
 */
const getUserRoleById = catchAsync(async (req, res) => {
  const { roleId } = req.params
  const userRole = await userRoleService.getRoleById(roleId)
  return res.status(200).json(ApiResponse.success(userRole, 'Lấy thông tin vai trò người dùng thành công'))
})

/**
 * Xóa vai trò người dùng (Admin)
 */
const deleteUserRole = catchAsync(async (req, res) => {
  const { roleId } = req.params
  const result = await userRoleService.deleteRole(roleId)
  return res.status(200).json(ApiResponse.success(result, 'Xóa vai trò người dùng thành công'))
})

/**
 * Kích hoạt/Vô hiệu hóa vai trò người dùng (Admin)
 */
const toggleUserRoleStatus = catchAsync(async (req, res) => {
  const { roleId } = req.params
  const { isActive } = req.body
  const updatedUserRole = await userRoleService.updateRole(roleId, { isActive })
  return res.status(200).json(ApiResponse.success(updatedUserRole, 'Cập nhật trạng thái vai trò người dùng thành công'))
})

/**
 * Cập nhật quyền hạn cho vai trò (Admin)
 */
const updateRolePermissions = catchAsync(async (req, res) => {
  const { roleId } = req.params
  const { permissions } = req.body
  const updatedUserRole = await userRoleService.updateUserRole(roleId, { 
    permissions,
    updatedBy: req.user._id,
    updatedAt: new Date()
  })
  return res.status(200).json(ApiResponse.success(updatedUserRole, 'Cập nhật quyền hạn vai trò thành công'))
})

/**
 * Lấy danh sách quyền hạn khả dụng (Admin)
 */
const getAvailablePermissions = catchAsync(async (req, res) => {
  const permissions = await userRoleService.getAvailablePermissions()
  return res.status(200).json(ApiResponse.success(permissions, 'Lấy danh sách quyền hạn khả dụng thành công'))
})

/**
 * Sao chép vai trò (Admin)
 */
const duplicateUserRole = catchAsync(async (req, res) => {
  const { roleId } = req.params
  const { newRoleName, newDescription } = req.body
  
  // Lấy thông tin vai trò gốc
  const originalRole = await userRoleService.getUserRoleById(roleId)
  
  // Tạo vai trò mới với thông tin tương tự
  const newRoleData = {
    roleName: newRoleName,
    description: newDescription || `Copy of ${originalRole.description}`,
    permissions: originalRole.permissions,
    isActive: true,
    createdBy: req.user._id
  }
  
  const duplicatedRole = await userRoleService.createUserRole(newRoleData)
  return res.status(201).json(ApiResponse.created(duplicatedRole, 'Sao chép vai trò thành công'))
})

/**
 * Lấy thống kê vai trò (Admin)
 */
const getUserRoleStats = catchAsync(async (req, res) => {
  const stats = await userRoleService.getUserRoleStats()
  return res.status(200).json(ApiResponse.success(stats, 'Lấy thống kê vai trò thành công'))
})

/**
 * Lấy danh sách người dùng theo vai trò (Admin)
 */
const getUsersByRole = catchAsync(async (req, res) => {
  const { roleId } = req.params
  const { page = 1, limit = 10 } = req.query
  
  const users = await userRoleService.getUsersByRole(roleId, parseInt(page), parseInt(limit))
  return res.status(200).json(ApiResponse.success(users, 'Lấy danh sách người dùng theo vai trò thành công'))
})

/**
 * Thiết lập kế thừa vai trò (Admin)
 */
const setRoleInheritance = catchAsync(async (req, res) => {
  const { roleId } = req.params
  const { inherits } = req.body
  const updatedUserRole = await userRoleService.updateUserRole(roleId, { 
    inherits,
    updatedBy: req.user._id,
    updatedAt: new Date()
  })
  return res.status(200).json(ApiResponse.success(updatedUserRole, 'Thiết lập kế thừa vai trò thành công'))
})

export const adminUserRoleController = {
  getUserRoles,
  createUserRole,
  updateUserRole,
  getUserRoleById,
  deleteUserRole,
  toggleUserRoleStatus,
  updateRolePermissions,
  getAvailablePermissions,
  duplicateUserRole,
  getUserRoleStats,
  getUsersByRole,
  setRoleInheritance
} 