import { USER_ROLES } from '~/constants'
import userRepository from '~/repositories/userRepository'
import userRoleRepository from '~/repositories/userRoleRepository'
import { ConflictError, NotFoundError } from '~/utils/errors'
import { pickUser } from '~/utils/formatter'

/**
 * Đăng ký người dùng mới
 * @param {Object} userData - Thông tin người dùng đăng ký
 * @param {String} creatorId - ID của người tạo tài khoản (nếu có)
 * @returns {Object} Thông tin người dùng đã đăng ký
 */
const register = async (userData, creatorId = null) => {
  // Kiểm tra người dùng đã tồn tại chưa
  const existedUser = await userRepository.checkExistingEmailOrPhone(userData.email, userData.phone)

  if (existedUser) {
    throw new ConflictError(
      'Phone number or email already exists!!',
      existedUser.email === userData.email ? 'email' : 'phone'
    )
  }

  // Xử lý roleId
  if (userData.roleId) {
    // Nếu roleId được chỉ định, kiểm tra xem nó có tồn tại không
    const roleExists = await userRoleRepository.findById(userData.roleId)
    if (!roleExists) {
      throw new NotFoundError(`Role with ID ${userData.roleId} not found`)
    }
  } else {
    // Nếu không có roleId, sử dụng vai trò Client làm mặc định
    const clientRole = await userRoleRepository.findByRoleName(USER_ROLES.CLIENT)
    if (!clientRole) {
      throw new Error('Default client role not found. Please initialize roles first.')
    }
    userData.roleId = clientRole._id
  }

  // Tạo người dùng mới
  const user = await userRepository.create({
    email: userData.email,
    password: userData.password,
    fullName: userData.fullName,
    phone: userData.phone,
    roleId: userData.roleId,
    parentId: creatorId // Người tạo tài khoản (nếu có)
  })

  // Lấy thông tin role để có roleName
  const userWithRole = await userRepository.findByIdWithRole(user._id)
  const userObj = userWithRole.toObject()
  if (userObj.roleId && userObj.roleId.roleName) {
    userObj.roleName = userObj.roleId.roleName
    delete userObj.roleId
  }

  return pickUser(userObj)
}

/**
 * Cập nhật thông tin người dùng
 * @param {string} userId - ID của người dùng
 * @param {Object} updateData - Dữ liệu cập nhật
 * @returns {Object} Thông tin người dùng đã cập nhật
 */
const updateUser = async (userId, updateData) => {
  const user = await userRepository.findById(userId)
  if (!user) {
    throw new NotFoundError('User not found')
  }

  // Không cho phép cập nhật email và phone qua API này
  delete updateData.email
  delete updateData.phone
  delete updateData.password

  // Cập nhật thông tin người dùng
  const updatedUser = await userRepository.updateById(userId, updateData)
  
  // Lấy thông tin role để có roleName
  const userWithRole = await userRepository.findByIdWithRole(userId)
  const userObj = userWithRole.toObject()
  if (userObj.roleId && userObj.roleId.roleName) {
    userObj.roleName = userObj.roleId.roleName
    delete userObj.roleId
  }
  
  return pickUser(userObj)
}

/**
 * Lấy thông tin người dùng theo ID
 * @param {string} userId - ID của người dùng
 * @returns {Object} Thông tin người dùng
 */
const getUserById = async (userId) => {
  const user = await userRepository.findByIdWithRole(userId)
  if (!user) {
    throw new NotFoundError('User not found')
  }
  
  // Transform để có roleName thay vì roleId
  const userObj = user.toObject()
  if (userObj.roleId && userObj.roleId.roleName) {
    userObj.roleName = userObj.roleId.roleName
    delete userObj.roleId
  }
  
  return pickUser(userObj)
}

/**
 * Lấy danh sách người dùng với phân trang
 * @param {Object} filter - Điều kiện lọc
 * @param {Number} page - Trang hiện tại
 * @param {Number} limit - Số lượng items mỗi trang
 * @returns {Object} Kết quả phân trang
 */
const getUsers = async (filter = {}, page = 1, limit = 10) => {
  const result = await userRepository.findWithPagination(filter, page, limit)

  // Loại bỏ thông tin nhạy cảm
  result.results = result.results.map((user) => pickUser(user))

  return result
}

/**
 * Tạo người dùng mới bởi Admin hoặc Đại lý
 * @param {Object} userData - Thông tin người dùng
 * @param {String} creatorId - ID của người tạo
 * @returns {Object} Thông tin người dùng đã tạo
 */
const createUser = async (userData, creatorId) => {
  if (!creatorId) {
    throw new Error('Creator ID is required')
  }

  // Kiểm tra người dùng đã tồn tại chưa
  const existedUser = await userRepository.checkExistingEmailOrPhone(userData.email, userData.phone)

  if (existedUser) {
    throw new ConflictError(
      'Phone number or email already exists!!',
      existedUser.email === userData.email ? 'email' : 'phone'
    )
  }

  // Xử lý roleId/roleName
  let roleId = userData.roleId
  
  if (userData.roleName) {
    // Nếu có roleName, tìm roleId tương ứng
    const role = await userRoleRepository.findByRoleName(userData.roleName)
    if (!role) {
      throw new NotFoundError(`Role with name ${userData.roleName} not found`)
    }
    roleId = role._id
  } else if (userData.roleId) {
    // Nếu có roleId, kiểm tra vai trò tồn tại
    const roleExists = await userRoleRepository.findById(userData.roleId)
    if (!roleExists) {
      throw new NotFoundError(`Role with ID ${userData.roleId} not found`)
    }
  } else {
    // Nếu không có cả hai, lấy vai trò Client làm mặc định
    const clientRole = await userRoleRepository.findByRoleName(USER_ROLES.CLIENT)
    if (!clientRole) {
      throw new Error('Default client role not found. Please initialize roles first.')
    }
    roleId = clientRole._id
  }

  // Tạo người dùng mới với thông tin người tạo
  const user = await userRepository.create({
    email: userData.email,
    password: userData.password,
    fullName: userData.fullName,
    phone: userData.phone,
    roleId: roleId,
    parentId: creatorId
  })

  // Lấy thông tin role để có roleName
  const userWithRole = await userRepository.findByIdWithRole(user._id)
  const userObj = userWithRole.toObject()
  if (userObj.roleId && userObj.roleId.roleName) {
    userObj.roleName = userObj.roleId.roleName
    delete userObj.roleId
  }

  return pickUser(userObj)
}

/**
 * Xóa người dùng theo ID
 * @param {string} userId - ID của người dùng cần xóa
 * @returns {Object} Thông tin xác nhận xóa
 */
const deleteUser = async (userId) => {
  const user = await userRepository.findById(userId)
  if (!user) {
    throw new NotFoundError('User not found')
  }

  // Kiểm tra không cho phép xóa admin
  const userWithRole = await userRepository.findByIdWithRole(userId)
  if (userWithRole.roleId && userWithRole.roleId.roleName === 'Admin') {
    throw new Error('Không thể xóa tài khoản Admin')
  }

  // Thực hiện xóa user
  await userRepository.deleteById(userId)

  return {
    deletedUserId: userId,
    message: 'Người dùng đã được xóa thành công'
  }
}

/**
 * Lấy danh sách người dùng được tạo bởi user hiện tại (admin hoặc đại lý)
 * @param {String} parentId - ID của user tạo ra các user khác (admin hoặc đại lý)
 * @param {Number} page - Trang hiện tại
 * @param {Number} limit - Số lượng items mỗi trang
 * @returns {Object} Danh sách người dùng được tạo với phân trang
 */
const getUsersCreatedByParent = async (parentId, page = 1, limit = 10) => {
  const result = await userRepository.findByParentIdWithPagination(parentId, page, limit)

  // Loại bỏ thông tin nhạy cảm
  result.results = result.results.map((user) => pickUser(user))

  return result
}

export const userService = {
  register,
  updateUser,
  getUserById,
  getUsers,
  createUser,
  deleteUser,
  getUsersCreatedByParent
}
