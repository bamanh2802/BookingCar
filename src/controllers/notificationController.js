import { StatusCodes } from 'http-status-codes'
import { userNotificationService } from '~/services/userNotificationService'
import ApiResponse from '~/utils/ApiResponse'
import { catchAsync } from '~/utils/catchAsync'

//Lấy tất cả thông báo của user
const getUserNotifications = catchAsync(async (req, res) => {
  const userId = req.user._id
  const { page = 1, limit = 10 } = req.query
  const notifications = await userNotificationService.getUserNotifications(userId, parseInt(page), parseInt(limit))

  return res.status(StatusCodes.OK).json(ApiResponse.success(notifications, 'Lấy danh sách thông báo thành công'))
})

//Đọc hêt tất cả thông báo
const markAllNotificationsAsRead = catchAsync(async (req, res) => {
  const userId = req.user._id

  await userNotificationService.markAllNotificationsAsRead(userId)

  return res.status(StatusCodes.OK).json(ApiResponse.success(null, 'Đã đọc tất cả thông báo'))
})

//Đọc 1 thông báo
const markNotificationAsRead = catchAsync(async (req, res) => {
  const userId = req.user._id
  const notificationId = req.params

  await userNotificationService.markNotificationAsRead(notificationId, userId)

  return res.status(StatusCodes.OK).json(ApiResponse.success(null, 'Đọc thông báo thành công'))
})

export const notificationController = { getUserNotifications, markAllNotificationsAsRead, markNotificationAsRead }
