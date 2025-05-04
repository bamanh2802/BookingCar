import { DEFAULT_ROLE_PERMISSIONS, USER_ROLES } from '~/constants'
import userRoleRepository from '~/repositories/userRoleRepository'
import { ConflictError, NotFoundError } from '~/utils/errors'

/**
 * Tạo vai trò mới
 * @param {Object} roleData - Thông tin vai trò
 * @returns {Promise<Object>} Vai trò đã tạo
 */
const createRole = async (roleData) => {
  // Kiểm tra tên vai trò đã tồn tại chưa
  const existingRole = await userRoleRepository.findByRoleName(roleData.roleName)
  if (existingRole) {
    throw new ConflictError(`Role with name ${roleData.roleName} already exists`)
  }

  // Tạo vai trò mới
  return userRoleRepository.create(roleData)
}

/**
 * Lấy thông tin vai trò theo ID
 * @param {String} roleId - ID của vai trò
 * @returns {Promise<Object>} Thông tin vai trò
 */
const getRoleById = async (roleId) => {
  const role = await userRoleRepository.findById(roleId)
  if (!role) {
    throw new NotFoundError('Role not found')
  }
  return role
}

/**
 * Lấy tất cả vai trò
 * @returns {Promise<Array>} Danh sách vai trò
 */
const getAllRoles = async () => {
  return userRoleRepository.findAllWithDetails()
}

/**
 * Cập nhật thông tin vai trò
 * @param {String} roleId - ID của vai trò
 * @param {Object} updateData - Dữ liệu cập nhật
 * @returns {Promise<Object>} Vai trò đã cập nhật
 */
const updateRole = async (roleId, updateData) => {
  const role = await userRoleRepository.findById(roleId)
  if (!role) {
    throw new NotFoundError('Role not found')
  }

  // Kiểm tra nếu đổi tên vai trò
  if (updateData.roleName && updateData.roleName !== role.roleName) {
    const existingRole = await userRoleRepository.findByRoleName(updateData.roleName)
    if (existingRole && existingRole._id.toString() !== roleId) {
      throw new ConflictError(`Role with name ${updateData.roleName} already exists`)
    }
  }

  return userRoleRepository.updateById(roleId, updateData)
}

/**
 * Cập nhật quyền cho vai trò
 * @param {String} roleId - ID của vai trò
 * @param {Array<String>} permissions - Danh sách quyền
 * @returns {Promise<Object>} Vai trò đã cập nhật
 */
const updateRolePermissions = async (roleId, permissions) => {
  const role = await userRoleRepository.findById(roleId)
  if (!role) {
    throw new NotFoundError('Role not found')
  }

  return userRoleRepository.updatePermissions(roleId, permissions)
}

/**
 * Cập nhật vai trò kế thừa
 * @param {String} roleId - ID của vai trò
 * @param {Array<String>} inherits - Danh sách ID vai trò kế thừa
 * @returns {Promise<Object>} Vai trò đã cập nhật
 */
const updateRoleInherits = async (roleId, inherits) => {
  const role = await userRoleRepository.findById(roleId)
  if (!role) {
    throw new NotFoundError('Role not found')
  }

  // Kiểm tra các vai trò kế thừa có tồn tại không
  for (const inheritId of inherits) {
    const inheritRole = await userRoleRepository.findById(inheritId)
    if (!inheritRole) {
      throw new NotFoundError(`Inherit role with ID ${inheritId} not found`)
    }
  }

  return userRoleRepository.updateInherits(roleId, inherits)
}

/**
 * Xóa vai trò
 * @param {String} roleId - ID của vai trò
 * @returns {Promise<Boolean>} Kết quả xóa
 */
const deleteRole = async (roleId) => {
  const role = await userRoleRepository.findById(roleId)
  if (!role) {
    throw new NotFoundError('Role not found')
  }

  // Kiểm tra có phải vai trò mặc định không
  if (Object.values(USER_ROLES).includes(role.roleName)) {
    throw new ConflictError('Cannot delete default role')
  }

  return userRoleRepository.deleteById(roleId)
}

/**
 * Tạo các vai trò mặc định
 * @returns {Promise<Array>} Danh sách vai trò đã tạo
 */
const createDefaultRoles = async () => {
  const defaultRoles = []

  // Tạo vai trò mặc định nếu chưa tồn tại
  for (const roleName of Object.values(USER_ROLES)) {
    const existingRole = await userRoleRepository.findByRoleName(roleName)
    if (!existingRole) {
      const newRole = await userRoleRepository.create({
        roleName,
        permissions: DEFAULT_ROLE_PERMISSIONS[roleName] || []
      })
      defaultRoles.push(newRole)
    }
  }

  return defaultRoles
}

/**
 * Lấy danh sách quyền của vai trò
 * @param {String} roleId - ID của vai trò
 * @returns {Promise<Array>} Danh sách quyền của vai trò
 */
const getRolePermissions = async (roleId) => {
  if (!roleId) {
    // Nếu không có roleId, trả về tất cả các quyền có sẵn
    return {
      availablePermissions: Object.values(DEFAULT_ROLE_PERMISSIONS).flat()
    }
  }

  const role = await userRoleRepository.findById(roleId)
  if (!role) {
    throw new NotFoundError('Role not found')
  }

  // Danh sách quyền của vai trò
  let permissions = [...role.permissions]

  // Nếu vai trò có kế thừa, thêm quyền từ các vai trò được kế thừa
  if (role.inherits && role.inherits.length > 0) {
    // Lấy thông tin chi tiết các vai trò kế thừa
    const inheritRoles = await Promise.all(role.inherits.map((id) => userRoleRepository.findById(id)))

    // Thêm quyền từ vai trò kế thừa
    inheritRoles.forEach((inheritRole) => {
      if (inheritRole && inheritRole.permissions) {
        permissions = [...permissions, ...inheritRole.permissions]
      }
    })
  }

  // Loại bỏ các quyền trùng lặp
  permissions = [...new Set(permissions)]

  return {
    name: role.roleName,
    permissions: permissions
  }
}

export const userRoleService = {
  createRole,
  getRoleById,
  getAllRoles,
  updateRole,
  updateRolePermissions,
  updateRoleInherits,
  deleteRole,
  createDefaultRoles,
  getRolePermissions
}
