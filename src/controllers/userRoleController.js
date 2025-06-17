import { StatusCodes } from 'http-status-codes'
import { PERMISSIONS } from '~/constants'
import { userRoleService } from '~/services/userRoleService'
import ApiResponse from '~/utils/ApiResponse'
import { catchAsync } from '~/utils/catchAsync'

/**
 * Tạo vai trò mới
 */
const createRole = catchAsync(async (req, res) => {
  const role = await userRoleService.createRole(req.body)
  res.status(StatusCodes.CREATED).json(
    ApiResponse.success({
      message: 'Tạo vai trò thành công',
      data: role
    })
  )
})

/**
 * Lấy danh sách tất cả vai trò
 */
const getAllRoles = catchAsync(async (req, res) => {
  const roles = await userRoleService.getAllRoles()
  res.status(StatusCodes.OK).json(
    ApiResponse.success({
      message: 'Lấy danh sách vai trò thành công',
      data: roles
    })
  )
})

/**
 * Lấy thông tin vai trò theo ID
 */
const getRoleById = catchAsync(async (req, res) => {
  const role = await userRoleService.getRoleById(req.params.roleId)
  res.status(StatusCodes.OK).json(
    ApiResponse.success({
      message: 'Lấy thông tin vai trò thành công',
      data: role
    })
  )
})

/**
 * Cập nhật thông tin vai trò
 */
const updateRole = catchAsync(async (req, res) => {
  const updatedRole = await userRoleService.updateRole(req.params.roleId, req.body)
  res.status(StatusCodes.OK).json(
    ApiResponse.success({
      message: 'Cập nhật vai trò thành công',
      data: updatedRole
    })
  )
})

/**
 * Cập nhật quyền cho vai trò
 */
const updateRolePermissions = catchAsync(async (req, res) => {
  const { permissions } = req.body
  const updatedRole = await userRoleService.updateRolePermissions(req.params.roleId, permissions)
  res.status(StatusCodes.OK).json(
    ApiResponse.success({
      message: 'Cập nhật quyền cho vai trò thành công',
      data: updatedRole
    })
  )
})

/**
 * Cập nhật vai trò kế thừa
 */
const updateRoleInherits = catchAsync(async (req, res) => {
  const { inherits } = req.body
  const updatedRole = await userRoleService.updateRoleInherits(req.params.roleId, inherits)
  res.status(StatusCodes.OK).json(
    ApiResponse.success({
      message: 'Cập nhật kế thừa cho vai trò thành công',
      data: updatedRole
    })
  )
})

/**
 * Xóa vai trò
 */
const deleteRole = catchAsync(async (req, res) => {
  await userRoleService.deleteRole(req.params.roleId)
  res.status(StatusCodes.OK).json(
    ApiResponse.success({
      message: 'Xóa vai trò thành công'
    })
  )
})

/**
 * Lấy danh sách quyền của vai trò
 */
const getRolePermissions = catchAsync(async (req, res) => {
  const rolePermissions = await userRoleService.getRolePermissions(req.params.roleId)
  res.status(StatusCodes.OK).json(
    ApiResponse.success({
      message: 'Lấy danh sách quyền vai trò thành công',
      data: rolePermissions
    })
  )
})

/**
 * Lấy danh sách tất cả quyền có sẵn trong hệ thống
 */
const getAllPermissions = catchAsync(async (req, res) => {
  const availablePermissions = Object.values(PERMISSIONS)
  res.status(StatusCodes.OK).json(
    ApiResponse.success({
      message: 'Lấy danh sách quyền thành công',
      data: {
        availablePermissions
      }
    })
  )
})

export const userRoleController = {
  createRole,
  getAllRoles,
  getRoleById,
  updateRole,
  updateRolePermissions,
  updateRoleInherits,
  deleteRole,
  getRolePermissions,
  getAllPermissions
}
