import userRepository from '~/repositories/userRepository'
import notificationRepository from '~/repositories/notificationRepository'
import { DOCUMENT_NAMES, USER_ROLES } from '~/constants'
import { userSocketStore } from '~/sockets/userStore'
import { getIO } from '~/sockets'
import userRoleRepository from '~/repositories/userRoleRepository'

/**
 * Gửi thông báo cho agent và admin khi có yêu cầu ticket mới
 * @param {Object} ticketRequest - Thông tin yêu cầu vé
 * @param {Object} currentUser - Người gửi yêu cầu
 */
export const notifyAgentsAndAdminsOnTicketRequest = async (ticketRequest, currentUser) => {
  // 1. Lấy agentlv2 (parentId của user)
  const user = await userRepository.findById(currentUser._id)
  //
  const agentLv2 = await userRepository.findById(user.parentId)

  // 2. Lấy agentlv1 (parentId của agentlv2)
  let agentLv1 = null
  if (agentLv2 && agentLv2.parentId) {
    agentLv1 = await userRepository.findById(agentLv2.parentId)
  }
  // 3. Lấy tất cả admin
  const adminRole = await userRoleRepository.findOne({ roleName: USER_ROLES.ADMIN })
  const admins = await userRepository.findAll({ roleId: adminRole._id })
  // Tổng hợp danh sách user cần gửi
  const notifyUsers = [...(agentLv2 ? [agentLv2] : []), ...(agentLv1 ? [agentLv1] : []), ...admins]
  // Loại bỏ trùng lặp theo _id
  const uniqueNotifyUsers = Array.from(new Map(notifyUsers.map((u) => [u._id.toString(), u])).values())

  if (!uniqueNotifyUsers.length) return

  const notificationData = {
    title: 'Yêu cầu vé mới',
    message: `${currentUser.fullName || 'Người dùng'} vừa gửi yêu cầu vé mới`,
    type: 'info',
    data: {
      ticketRequestId: ticketRequest._id,
      userId: currentUser._id
    },
    targetType: DOCUMENT_NAMES.TICKET_REQUEST,
    targetId: ticketRequest._id,
    action: ticketRequest.titleRequest
  }

  // Lưu thông báo vào DB
  const notifications = uniqueNotifyUsers.map((user) => ({
    ...notificationData,
    user: user._id,
    isRead: false
  }))
  await notificationRepository.createManyNotifications(notifications)

  // Gửi socket đến các user online
  const io = getIO()
  uniqueNotifyUsers.forEach((user) => {
    const socketId = userSocketStore.getSocketId(user._id.toString())
    if (socketId && io) {
      io.to(socketId).emit('notification', { ...notificationData, user: user._id })
    }
  })
}
