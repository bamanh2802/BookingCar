import logger from '~/utils/logger'

const onlineUser = new Map()

const addUser = (userId, socketId) => {
  onlineUser.set(userId, socketId)
  logger.info(`[Socket store] User added: ${userId} -> socketId: ${socketId}`)
}

const removeUserBySocketId = (socketId) => {
  for (let [userId, id] of onlineUser.entries()) {
    if (id === socketId) {
      onlineUser.delete(userId)
      logger.info(`[Socket store] User removed: ${userId}`)
      break
    }
  }
}

const getSocketId = (userId) => {
  return onlineUser.get(userId)
}

export const userSocketStore = { addUser, removeUserBySocketId, getSocketId }
