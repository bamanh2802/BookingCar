import { userService } from '~/services/userService'
import ApiResponse from '~/utils/ApiResponse'
import { catchAsync } from '~/utils/catchAsync'

/**
 * Lấy danh sách người dùng (Admin)
 */
const getUsers = catchAsync(async (req, res) => {
  // Lấy tham số từ query
  const { page = 1, limit = 10, roleId, parentId } = req.query

  // Tạo filter
  const filter = {}

  if (roleId) {
    filter.roleId = roleId
  }

  // Nếu người dùng không phải admin, chỉ hiển thị người dùng do họ tạo ra
  if (!req.userRole || req.userRole.roleName !== 'Admin') {
    // Nếu parentId được chỉ định, kiểm tra xem người dùng có quyền xem không
    if (parentId) {
      // Kiểm tra xem parentId có phải là người dùng hiện tại hoặc do người dùng hiện tại tạo ra
      if (parentId !== req.user._id.toString()) {
        // Kiểm tra xem parentId có phải là người dùng do người dùng hiện tại tạo ra không
        const parent = await userService.getUserById(parentId)
        if (!parent || parent.parentId !== req.user._id.toString()) {
          return res.status(403).json(ApiResponse.forbidden('Bạn không có quyền xem người dùng này'))
        }
      }
      filter.parentId = parentId
    } else {
      // Mặc định chỉ hiển thị người dùng do họ tạo ra
      filter.parentId = req.user._id
    }
  } else if (parentId) {
    // Admin có thể xem tất cả, nhưng vẫn lọc theo parentId nếu được chỉ định
    filter.parentId = parentId
  }

  const users = await userService.getUsers(filter, parseInt(page), parseInt(limit))
  return res.status(200).json(ApiResponse.success(users, 'Lấy danh sách người dùng thành công'))
})

/**
 * Tạo người dùng mới (Admin)
 */
const createUser = catchAsync(async (req, res) => {
  // Lấy ID của người tạo từ request
  const creatorId = req.user._id

  // Tạo người dùng mới
  const createdUser = await userService.createUser(req.body, creatorId)
  return res.status(201).json(ApiResponse.created(createdUser, 'Tạo người dùng thành công'))
})

/**
 * Cập nhật thông tin người dùng (Admin)
 */
const updateUser = catchAsync(async (req, res) => {
  const { userId } = req.params
  const updatedUser = await userService.updateUser(userId, req.body)
  return res.status(200).json(ApiResponse.success(updatedUser, 'Cập nhật thông tin người dùng thành công'))
})

/**
 * Lấy thông tin người dùng theo ID (Admin)
 */
const getUserById = catchAsync(async (req, res) => {
  const { userId } = req.params
  const user = await userService.getUserById(userId)
  return res.status(200).json(ApiResponse.success(user, 'Lấy thông tin người dùng thành công'))
})

/**
 * Xóa người dùng (Admin)
 */
const deleteUser = catchAsync(async (req, res) => {
  const { userId } = req.params
  const result = await userService.deleteUser(userId)
  return res.status(200).json(ApiResponse.success(result, 'Xóa người dùng thành công'))
})

export const adminUserController = {
  getUsers,
  createUser,
  updateUser,
  getUserById,
  deleteUser
}