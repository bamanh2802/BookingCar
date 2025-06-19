import { userModel } from '~/models/userModel'
import BaseRepository from './baseRepository'

/**
 * Repository xử lý tương tác với collection User
 * @extends BaseRepository
 */
class UserRepository extends BaseRepository {
  constructor() {
    super(userModel)
  }

  /**
   * Tìm người dùng theo email hoặc số điện thoại
   * @param {String} emailOrPhone - Email hoặc số điện thoại
   * @returns {Promise<Object>} User document
   */
  async findByEmailOrPhone(emailOrPhone) {
    return this.findOne({
      $or: [{ email: emailOrPhone }, { phone: emailOrPhone }]
    })
  }

  /**
   * Tìm người dùng theo ID với thông tin role
   * @param {String} id - User ID
   * @returns {Promise<Object>} User document với roleName
   */
  async findByIdWithRole(id) {
    return this.model.findById(id).populate('roleId', 'roleName')
  }

  /**
   * Tìm người dùng theo email hoặc số điện thoại với thông tin role
   * @param {String} emailOrPhone - Email hoặc số điện thoại
   * @returns {Promise<Object>} User document với roleName
   */
  async findByEmailOrPhoneWithRole(emailOrPhone) {
    return this.model.findOne({
      $or: [{ email: emailOrPhone }, { phone: emailOrPhone }]
    }).populate('roleId', 'roleName')
  }

  /**
   * Kiểm tra email hoặc số điện thoại đã tồn tại chưa
   * @param {String} email - Email
   * @param {String} phone - Số điện thoại
   * @returns {Promise<Object|null>} User document hoặc null
   */
  async checkExistingEmailOrPhone(email, phone) {
    return this.findOne({
      $or: [{ email }, { phone }]
    })
  }

  /**
   * Tìm users với phân trang và thông tin role
   * @param {Object} filter - Điều kiện lọc
   * @param {Number} page - Trang hiện tại (bắt đầu từ 1)
   * @param {Number} limit - Số lượng items mỗi trang
   * @param {Object} sort - Điều kiện sắp xếp
   * @returns {Promise<Object>} Kết quả phân trang với roleName
   */
  async findWithPagination(filter = {}, page = 1, limit = 10, sort = { createdAt: -1 }) {
    const skip = (page - 1) * limit

    const [results, total] = await Promise.all([
      this.model.find(filter).populate('roleId', 'roleName').skip(skip).limit(limit).sort(sort),
      this.count(filter)
    ])

    // Transform kết quả để có roleName thay vì roleId
    const transformedResults = results.map(user => {
      const userObj = user.toObject()
      if (userObj.roleId && userObj.roleId.roleName) {
        userObj.roleName = userObj.roleId.roleName
        delete userObj.roleId
      }
      return userObj
    })

    return {
      results: transformedResults,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    }
  }
}

// Singleton pattern
const userRepository = new UserRepository()
export default userRepository
