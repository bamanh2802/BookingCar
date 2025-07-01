import { notificationModel } from '~/models/notificationModel'
import BaseRepository from './baseRepository'

class NotificationRepository extends BaseRepository {
  constructor() {
    super(notificationModel)
  }

  async getUserNotifications(userId, page = 1, limit = 10) {
    const filter = { $or: [{ user: userId }, { role: { $ne: null } }] }
    const notifications = await notificationModel
      .find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean()
    const total = await notificationModel.countDocuments(filter)
    return {
      results: notifications,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    }
  }

  async createManyNotifications(notifications) {
    if (!Array.isArray(notifications) || notifications.length === 0) return []
    return this.model.insertMany(notifications)
  }
}

const notificationRepository = new NotificationRepository()

export default notificationRepository
