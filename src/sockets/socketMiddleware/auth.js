const { env } = require('~/config/environment')
const { jwtProvider } = require('~/providers/jwtProvider')
const { catchAsync } = require('~/utils/catchAsync')
const { AuthenticationError } = require('~/utils/errors')

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
