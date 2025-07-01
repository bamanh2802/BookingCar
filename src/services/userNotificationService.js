import notificationRepository from '~/repositories/notificationRepository'

/**
 * Lấy danh sách thông báo của user (có phân trang)
 */
const getUserNotifications = async (userId, page, limit) => {
  const notifications = await notificationRepository.getUserNotifications(userId, page, limit)

  return notifications
}

/**
 * Đánh dấu đã đọc thông báo
 */
const markNotificationAsRead = async (notificationId, userId) => {
  const notification = await notificationRepository.findOne({ _id: notificationId, user: userId })
  if (!notification) return null
  notification.isRead = true
  await notification.save()
  return notification
}

/**
 * Đánh dấu tất cả thông báo là đã đọc
 */
const markAllNotificationsAsRead = async (userId) => {
  await notificationRepository.updateMany({ user: userId, isRead: false }, { $set: { isRead: true } })
}

export const userNotificationService = { getUserNotifications, markAllNotificationsAsRead, markNotificationAsRead }
