import { userModel } from "~/models/userModel";
import BaseRepository from "./baseRepository";

/**
 * Repository xử lý tương tác với collection User
 * @extends BaseRepository
 */
class UserRepository extends BaseRepository {
  constructor() {
    super(userModel);
  }

  /**
   * Tìm người dùng theo email hoặc số điện thoại
   * @param {String} emailOrPhone - Email hoặc số điện thoại
   * @returns {Promise<Object>} User document
   */
  async findByEmailOrPhone(emailOrPhone) {
    return this.findOne({
      $or: [{ email: emailOrPhone }, { phone: emailOrPhone }]
    });
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
    });
  }

  /**
   * Tìm users với phân trang
   * @param {Object} filter - Điều kiện lọc
   * @param {Number} page - Trang hiện tại (bắt đầu từ 1)
   * @param {Number} limit - Số lượng items mỗi trang
   * @param {Object} sort - Điều kiện sắp xếp
   * @returns {Promise<Object>} Kết quả phân trang
   */
  async findWithPagination(filter = {}, page = 1, limit = 10, sort = { createdAt: -1 }) {
    const skip = (page - 1) * limit;

    const [results, total] = await Promise.all([
      this.findAll(filter, "", { skip, limit, sort }),
      this.count(filter)
    ]);

    return {
      results,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    };
  }
}

// Singleton pattern
const userRepository = new UserRepository();
export default userRepository;
