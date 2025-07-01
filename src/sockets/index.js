import { Server } from 'socket.io'
import { env } from '~/config/environment'
import { socketAuthMiddleware } from './socketMiddleware/auth'
import logger from '~/utils/logger'
import { userSocketStore } from './userStore'

let io = null

export const initialSocketServer = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: ['http://localhost:3000', 'https://vexenay.com', 'https://admin.vexenay.com'],
      methods: ['GET', 'POST'],
      credentials: true
    }
  })

  io.use(socketAuthMiddleware)

  io.on('connection', (socket) => {
    logger.info(`[Socket IO] ✅ User connected: ${socket.user._id} with socket ID: ${socket.id}`)

    userSocketStore.addUser(socket.user._id, socket.id)

    socket.on('disconnect', () => {
      logger.info(`[Socket IO] ❌ User disconnected: ${socket.id}`)
      userSocketStore.removeUserBySocketId(socket.id)
    })
  })

  logger.info('🚀 Socket.IO server has been initialized successfully!')
}

export const getIO = () => {
  if (!io) throw new Error('Socket.IO chưa được khởi tạo')

  return io
}
