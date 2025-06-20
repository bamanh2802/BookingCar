import ms from 'ms'
import { authService } from '~/services/authService'
import { userService } from '~/services/userService'
import ApiResponse from '~/utils/ApiResponse'
import { catchAsync } from '~/utils/catchAsync'

/**
 * Đăng ký người dùng mới
 */
const register = catchAsync(async (req, res) => {
  const createdUser = await userService.register(req.body)
  return res.status(201).json(ApiResponse.created(createdUser, 'Đăng ký tài khoản thành công'))
})

/**
 * Đăng nhập
 */
const login = catchAsync(async (req, res) => {
  const userInfo = await authService.login(req.body)

  // Thiết lập cookies
  res.cookie('accessToken', userInfo.accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    maxAge: ms('14 days')
  })

  res.cookie('refreshToken', userInfo.refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    maxAge: ms('14 days')
  })

  return res.status(200).json(ApiResponse.success(userInfo, 'Đăng nhập thành công'))
})

/**
 * Cập nhật thông tin người dùng
 */
const updateProfile = catchAsync(async (req, res) => {
  const userId = req.user._id
  const updatedUser = await userService.updateUser(userId, req.body)
  return res.status(200).json(ApiResponse.success(updatedUser, 'Cập nhật thông tin thành công'))
})

/**
 * Lấy thông tin người dùng hiện tại
 */
const getProfile = catchAsync(async (req, res) => {
  const userId = req.user._id
  const user = await userService.getUserById(userId)
  return res.status(200).json(ApiResponse.success(user, 'Lấy thông tin người dùng thành công'))
})

/**
 * Refresh token
 */
const refreshToken = catchAsync(async (req, res) => {
  const { refreshToken } = req.cookies
  if (!refreshToken) {
    return res.status(401).json(ApiResponse.unauthorized('Refresh token không tồn tại'))
  }

  const result = await authService.refreshToken(refreshToken)

  // Cập nhật access token mới trong cookie
  res.cookie('accessToken', result.accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    maxAge: ms('14 days')
  })

  return res.status(200).json(ApiResponse.success(result, 'Refresh token thành công'))
})

/**
 * Lấy danh sách người dùng được tạo bởi admin hoặc đại lý hiện tại
 */
const getMyCreatedUsers = catchAsync(async (req, res) => {
  const currentUserId = req.user._id
  const page = parseInt(req.query.page) || 1
  const limit = parseInt(req.query.limit) || 10

  const result = await userService.getUsersCreatedByParent(currentUserId, page, limit)
  
  return res.status(200).json(
    ApiResponse.success(result, 'Lấy danh sách người dùng được tạo thành công')
  )
})

// Admin functions moved to adminUserController.js

export const userController = {
  register,
  login,
  updateProfile,
  getProfile,
  refreshToken,
  getMyCreatedUsers
}
