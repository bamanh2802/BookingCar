import mongoose, { Schema } from 'mongoose'

const notificationSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
    type: { type: String, enum: ['info', 'warning', 'success', 'error', 'system'], default: 'info' },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: false }, // Có thể null nếu là thông báo hệ thống
    role: { type: String, default: null }, // Lưu vai trò nhận nếu là thông báo nhóm,
    action: { type: String, default: null },
    isRead: { type: Boolean, default: false },
    isSystem: { type: Boolean, default: false }, // Phân biệt thông báo hệ thống
    targetType: { type: String, default: null }, // Loại đối tượng liên quan (Ticket, Trip, ...)
    targetId: { type: Schema.Types.Mixed, default: null }, // ID đối tượng liên quan
    data: { type: Schema.Types.Mixed, default: null }
  },
  { timestamps: true }
)

export const notificationModel = mongoose.model('Notification', notificationSchema)
