import { env } from '~/config/environment'
import { jwtProvider } from '~/providers/jwtProvider'
import userRepository from '~/repositories/userRepository'
import userRoleRepository from '~/repositories/userRoleRepository'
import { catchAsync } from '~/utils/catchAsync'
import { AuthenticationError } from '~/utils/errors'
import ticketRequestRepository from '~/repositories/ticketRequestRepository'
import { TICKET_STATUS, PERMISSIONS } from '~/constants'

/**
 * Middleware kiểm tra người dùng đã đăng nhập chưa
 * Kiểm tra JWT access token trong cookie hoặc header
 */
const authenticate = catchAsync(async (req, res, next) => {
  // Lấy token từ cookie hoặc Authorization header
  let token = req.cookies?.accessToken

  // Nếu không có trong cookie, kiểm tra trong header
  if (!token && req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1]
  }

  // Nếu không tìm thấy token
  if (!token) {
    throw new AuthenticationError('Bạn chưa đăng nhập. Vui lòng đăng nhập để tiếp tục.')
  }

  try {
    // Verify token
    const decoded = await jwtProvider.verifyToken(token, env.ACCESS_TOKEN_SECRET_KEY)

    // Lưu thông tin người dùng vào request object
    req.user = decoded

    next()
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new AuthenticationError('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.')
    }

    throw new AuthenticationError('Token không hợp lệ. Vui lòng đăng nhập lại.')
  }
})

/**
 * Middleware giới hạn quyền truy cập dựa trên vai trò người dùng
 * @param  {...String} roles - Danh sách các vai trò được phép truy cập
 */
const restrictTo = (...roles) => {
  return catchAsync(async (req, res, next) => {
    // Phải gọi sau middleware authenticate
    if (!req.user) {
      throw new AuthenticationError('Bạn chưa đăng nhập. Vui lòng đăng nhập để tiếp tục.')
    }

    // Lấy thông tin người dùng từ database bao gồm role
    const user = await userRepository.findById(req.user._id)
    if (!user || !user.roleId) {
      throw new AuthenticationError('Không tìm thấy thông tin vai trò người dùng')
    }

    // Lấy thông tin vai trò
    const userRole = await userRoleRepository.findById(user.roleId)
    if (!userRole) {
      throw new AuthenticationError('Vai trò người dùng không hợp lệ')
    }

    // Kiểm tra xem người dùng có vai trò phù hợp không
    if (!roles.includes(userRole.roleName)) {
      throw new AuthenticationError('Bạn không có quyền thực hiện hành động này')
    }

    // Lưu thông tin vai trò vào request để sử dụng sau này
    req.userRole = userRole

    next()
  })
}

/**
 * Middleware kiểm tra người dùng có quyền cụ thể không
 * @param  {...String} permissions - Danh sách các quyền yêu cầu
 */
const hasPermission = (...permissions) => {
  return catchAsync(async (req, res, next) => {
    // Phải gọi sau middleware authenticate
    if (!req.user) {
      throw new AuthenticationError('Bạn chưa đăng nhập. Vui lòng đăng nhập để tiếp tục.')
    }

    // Lấy thông tin người dùng từ database bao gồm role
    const user = await userRepository.findById(req.user._id)
    if (!user || !user.roleId) {
      throw new AuthenticationError('Không tìm thấy thông tin vai trò người dùng')
    }

    // Lấy thông tin vai trò
    const userRole = await userRoleRepository.findById(user.roleId)
    if (!userRole) {
      throw new AuthenticationError('Vai trò người dùng không hợp lệ')
    }

    // Lấy danh sách quyền của vai trò và quyền kế thừa
    let allPermissions = [...userRole.permissions]

    // Thêm quyền từ các vai trò kế thừa nếu có
    if (userRole.inherits && userRole.inherits.length > 0) {
      // Lấy tất cả vai trò kế thừa
      const inheritRoles = await userRoleRepository.model.find({
        _id: { $in: userRole.inherits }
      })

      // Thêm quyền từ các vai trò kế thừa
      for (const role of inheritRoles) {
        allPermissions = [...allPermissions, ...role.permissions]
      }
    }

    // Loại bỏ quyền trùng lặp
    allPermissions = [...new Set(allPermissions)]

    // Kiểm tra xem người dùng có tất cả các quyền yêu cầu không
    const hasAllPermissions = permissions.every((permission) => allPermissions.includes(permission))

    if (!hasAllPermissions) {
      throw new AuthenticationError('Bạn không có quyền thực hiện hành động này')
    }

    // Lưu thông tin vai trò và quyền vào request để sử dụng sau này
    req.userRole = userRole
    req.userPermissions = allPermissions

    next()
  })
}

/**
 * Middleware kiểm tra người dùng có quyền quản lý người dùng cấp dưới không
 */
const canManageUser = catchAsync(async (req, res, next) => {
  // Phải gọi sau middleware authenticate
  if (!req.user) {
    throw new AuthenticationError('Bạn chưa đăng nhập. Vui lòng đăng nhập để tiếp tục.')
  }

  // Lấy ID của người dùng cần quản lý từ request params
  const targetUserId = req.params.userId
  if (!targetUserId) {
    throw new AuthenticationError('Không tìm thấy ID người dùng cần quản lý')
  }

  // Lấy thông tin người dùng hiện tại
  const currentUser = await userRepository.findById(req.user._id)
  if (!currentUser || !currentUser.roleId) {
    throw new AuthenticationError('Không tìm thấy thông tin vai trò người dùng')
  }

  // Lấy thông tin người dùng cần quản lý
  const targetUser = await userRepository.findById(targetUserId)
  if (!targetUser) {
    throw new AuthenticationError('Không tìm thấy người dùng cần quản lý')
  }

  // Lấy thông tin vai trò của cả hai người dùng
  const [currentUserRole, targetUserRole] = await Promise.all([
    userRoleRepository.findById(currentUser.roleId),
    userRoleRepository.findById(targetUser.roleId)
  ])

  if (!currentUserRole || !targetUserRole) {
    throw new AuthenticationError('Vai trò người dùng không hợp lệ')
  }

  // Kiểm tra quyền quản lý
  let canManage = false

  // Admin có thể quản lý tất cả
  if (currentUserRole.roleName === 'Admin') {
    canManage = true
  }
  // Đại lý cấp 1 có thể quản lý Đại lý cấp 2 và người dùng
  else if (
    currentUserRole.roleName === 'AgentLv1' &&
    (targetUserRole.roleName === 'AgentLv2' || targetUserRole.roleName === 'Client')
  ) {
    canManage = true
  }
  // Đại lý cấp 2 chỉ có thể quản lý người dùng
  else if (currentUserRole.roleName === 'AgentLv2' && targetUserRole.roleName === 'Client') {
    canManage = true
  }
  // Kiểm tra xem người dùng cần quản lý có phải do người dùng hiện tại tạo ra không
  else if (targetUser.parentId && targetUser.parentId.toString() === currentUser._id.toString()) {
    canManage = true
  }

  if (!canManage) {
    throw new AuthenticationError('Bạn không có quyền quản lý người dùng này')
  }

  next()
})

/**
 * Middleware: Chỉ cho phép CLIENT xem ticket requests/ticket của chính họ
 */
const checkViewTicketByUserId = catchAsync(async (req, res, next) => {
  const { userId } = req.params
  const userRole = req.userRole?.roleName
  if (userRole === 'Client' && req.user._id.toString() !== userId) {
    return res.status(403).json({ message: 'Bạn không có quyền xem !' })
  }
  next()
})

/**
 * Middleware: Chỉ cho phép CLIENT xem trip liên quan đến mình, role khác xem được tất cả
 */
const checkViewTripByUserRole = catchAsync(async (req, res, next) => {
  const userRole = req.userRole?.roleName
  if (userRole !== 'Client') return next()

  const { tripId } = req.params
  const userId = req.user._id.toString()
  // Kiểm tra xem tripId có liên quan đến user này không (dựa vào ticketRequest)
  const ticketRequest = await ticketRequestRepository.findTicketRequestByUserIdAndTripId(userId, tripId)
  if (!ticketRequest) {
    return res.status(403).json({ message: 'Bạn không có quyền xem thông tin chuyến đi này.' })
  }
  next()
})

/**
 * Middleware: Chỉ cho phép CLIENT xem ticketRequestId của chính họ, role khác xem được tất cả
 */
const checkViewTicketRequestById = catchAsync(async (req, res, next) => {
  const userRole = req.userRole?.roleName
  if (userRole !== 'Client') return next()
  const { ticketRequestId } = req.params
  const userId = req.user._id.toString()

  const ticketRequest = await ticketRequestRepository.findTicketRequestById(ticketRequestId)
  if (!ticketRequest || ticketRequest.userId.toString() !== userId) {
    return res.status(403).json({ message: 'Bạn không có quyền thực hiện hành động cho yêu cầu vé này.' })
  }
  next()
})

/**
 * Middleware kiểm tra quyền update/cancel ticket
 * Nếu status là CANCELLED thì chỉ cần authenticate, ngược lại phải có quyền UPDATE_TICKET
 */
const checkUpdateOrCancelTicket = catchAsync((req, res, next) => {
  const { status } = req.body
  if (status === TICKET_STATUS.CANCELLED) {
    return next()
  }
  return authMiddleware.hasPermission(PERMISSIONS.UPDATE_TICKET)(req, res, next)
})

// Kiểm tra xem người dùng có phải là mình hay không
const isSelf = catchAsync(async (req, res, next) => {
  const userRole = req.userRole?.roleName
  if (userRole !== 'Client') return next()
  const { userId } = req.params
  if (!userId || req.user._id.toString() !== userId) {
    return res.status(403).json({ message: 'Bạn không có quyền truy cập vào thông tin này.' })
  }
  next()
})

export const authMiddleware = {
  authenticate,
  restrictTo,
  hasPermission,
  canManageUser,
  checkViewTicketByUserId,
  checkViewTripByUserRole,
  checkViewTicketRequestById,
  checkUpdateOrCancelTicket,
  isSelf
}
