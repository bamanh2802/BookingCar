/**
 * Lớp Repository cơ sở làm nền tảng cho tất cả repositories
 * Cung cấp các phương thức CRUD cơ bản
 */
class BaseRepository {
  /**
   * @param {mongoose.Model} model - Mongoose model
   */
  constructor(model) {
    this.model = model
  }

  /**
   * Tìm tất cả documents
   * @param {Object} filter - Filter criteria
   * @param {String} projection - Fields to include/exclude
   * @param {Object} options - Query options (sort, pagination, etc.)
   * @returns {Promise<Array>} Documents array
   */
  async findAll(filter = {}, projection = '', options = {}) {
    return this.model.find(filter, projection, options)
  }

  /**
   * Tìm document theo ID
   * @param {String} id - Document ID
   * @param {String} projection - Fields to include/exclude
   * @returns {Promise<Object>} Document
   */
  async findById(id, projection = '') {
    return this.model.findById(id, projection)
  }

  /**
   * Tìm document theo điều kiện
   * @param {Object} filter - Filter criteria
   * @param {String} projection - Fields to include/exclude
   * @param {Object} options - Query options
   * @returns {Promise<Object>} Document
   */
  async findOne(filter, projection = '', options = {}) {
    return this.model.findOne(filter, projection, options)
  }

  /**
   * Tạo document mới
   * @param {Object} data - Document data
   * @returns {Promise<Object>} Created document
   */
  async create(data) {
    return this.model.create(data)
  }

  /**
   * Cập nhật document theo ID
   * @param {String} id - Document ID
   * @param {Object} data - Update data
   * @param {Object} options - Update options
   * @returns {Promise<Object>} Updated document
   */
  async updateById(id, data, options = { new: true }) {
    return this.model.findByIdAndUpdate(id, data, options)
  }

  /**
   * Cập nhật nhiều documents
   * @param {Object} filter - Filter criteria
   * @param {Object} data - Update data
   * @returns {Promise<Object>} Update result
   */
  async updateMany(filter, data) {
    return this.model.updateMany(filter, data)
  }

  /**
   * Xóa document theo ID
   * @param {String} id - Document ID
   * @returns {Promise<Object>} Deleted document
   */
  async deleteById(id) {
    return this.model.findByIdAndDelete(id)
  }

  /**
   * Xóa nhiều documents
   * @param {Object} filter - Filter criteria
   * @returns {Promise<Object>} Delete result
   */
  async deleteMany(filter) {
    return this.model.deleteMany(filter)
  }

  /**
   * Đếm số lượng documents
   * @param {Object} filter - Filter criteria
   * @returns {Promise<Number>} Count
   */
  async count(filter = {}) {
    return this.model.countDocuments(filter)
  }

  /**
   * Kiểm tra document tồn tại
   * @param {Object} filter - Filter criteria
   * @returns {Promise<Boolean>} True if exists
   */
  async exists(filter) {
    return this.model.exists(filter)
  }

  /**
   * Tìm kiếm với phân trang
   * @param {Object} filter - Filter criteria
   * @param {Number} page - Current page
   * @param {Number} limit - Number of items per page
   * @param {Object} sort - Sort options
   * @returns {Promise<Object>} Paginated results
   */
  async findWithPagination(filter = {}, page = 1, limit = 10, sort = { createdAt: -1 }) {
    const skip = (page - 1) * limit
    const [results, total] = await Promise.all([this.findAll(filter, '', { skip, limit, sort }), this.count(filter)])
    return {
      results,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  }
}

export default BaseRepository
