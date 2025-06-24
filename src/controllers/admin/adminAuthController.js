import ms from 'ms'
import { authService } from '~/services/authService'
import { userService } from '~/services/userService'
import ApiResponse from '~/utils/ApiResponse'
import { catchAsync } from '~/utils/catchAsync'

/**
 * Admin đăng nhập
 */
const login = catchAsync(async (req, res) => {
  const userInfo = await authService.login(req.body)

  // Thiết lập cookies với shorter expiry for admin
  res.cookie('accessToken', userInfo.accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    maxAge: ms('1 day') // Shorter for admin security
  })

  res.cookie('refreshToken', userInfo.refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    maxAge: ms('7 days') // Shorter refresh token for admin
  })

  return res.status(200).json(ApiResponse.success(userInfo, 'Admin đăng nhập thành công'))
})

/**
 * Admin refresh token
 */
const refreshToken = catchAsync(async (req, res) => {
  const { refreshToken } = req.cookies
  if (!refreshToken) {
    return res.status(401).json(ApiResponse.unauthorized('Refresh token không tồn tại'))
  }

  const result = await authService.refreshToken(refreshToken)

  // Cập nhật access token mới trong cookie với shorter expiry
  res.cookie('accessToken', result.accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    maxAge: ms('1 day') // Shorter for admin security
  })

  return res.status(200).json(ApiResponse.success(result, 'Refresh token thành công'))
})

/**
 * Admin logout - invalidate tokens
 */
const logout = catchAsync(async (req, res) => {
  // Clear cookies immediately
  res.clearCookie('accessToken', {
    httpOnly: true,
    secure: true,
    sameSite: 'none'
  })

  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: true,
    sameSite: 'none'
  })

  // TODO: Add to blacklist when Redis is integrated
  // if (req.adminToken) {
  //   await addTokenToBlacklist(req.adminToken)
  // }

  return res.status(200).json(ApiResponse.success(null, 'Admin đăng xuất thành công'))
})

/**
 * Lấy thông tin admin hiện tại
 */
const getProfile = catchAsync(async (req, res) => {
  const userId = req.user._id
  const user = await userService.getUserById(userId)
  return res.status(200).json(ApiResponse.success(user, 'Lấy thông tin admin thành công'))
})

/**
 * Cập nhật thông tin admin
 */
const updateProfile = catchAsync(async (req, res) => {
  const userId = req.user._id
  const updatedUser = await userService.updateUser(userId, req.body)
  return res.status(200).json(ApiResponse.success(updatedUser, 'Cập nhật thông tin admin thành công'))
})

export const adminAuthController = {
  login,
  refreshToken,
  logout,
  getProfile,
  updateProfile
} 