import { env } from '~/config/environment'
import { jwtProvider } from '~/providers/jwtProvider'
import { catchAsync } from '~/utils/catchAsync'
import { AuthenticationError } from '~/utils/errors'

export const socketAuthMiddleware = catchAsync(async (socket, next) => {
  const token = socket.handshake.auth?.token
  if (!token) next(new AuthenticationError('Token không tồn tại'))

  try {
    const decoded = await jwtProvider.verifyToken(token, env.ACCESS_TOKEN_SECRET_KEY)

    socket.user = decoded
    next()
  } catch (error) {
    if (error.name === 'TokenExpiredError') next(new AuthenticationError('Phiên đăng nhập đã hết hạn'))

    return next(new AuthenticationError('Token không hợp lệ'))
  }
})
