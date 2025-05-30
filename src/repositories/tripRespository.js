import { tripModel } from '~/models/tripModel'
import BaseRepository from './baseRepository'

class TripRespository extends BaseRepository {
  constructor() {
    super(tripModel)
  }

  /**
   * * Tìm kiếm chuyến đi theo ID
   * @param {String} tripId - ID của chuyến đi
   */
  async findTripById(tripId) {
    return this.findOne({ _id: tripId })
  }

  /**
   * * Tìm kiếm chuyến đi theo ID người dùng
   */
  async findTripByUserId(userId) {
    return this.findAll({ userId })
  }

  /**
   * Taọ chuyến đi mới
   */
  async createTrip(trip) {
    return this.create(trip)
  }

  /**
   * Cập nhật chuyến đi
   * @param {String} tripId - ID của chuyến đi
   * @param {Object} updateData - Dữ liệu cập nhật
   */
  async updateTrip(tripId, updateData) {
    return this.updateById(tripId, updateData)
  }

  /**
   * Xóa chuyến đi
   * @param {String} tripId - ID của chuyến đi
   */
  async deleteTrip(tripId) {
    return this.deleteById(tripId)
  }

  /**
   * Tìm chuyến đi theo ID người dùng và ID chuyến đi
   * @param {String} userId - ID của người dùng
   * @param {String} tripId - ID của chuyến đi
   */
  async findTripByUserIdAndTripId(userId, tripId) {
    return this.findOne({ userId, tripId })
  }

  /**
   * Lấy tất cả chuyến đi với phân trang
   */
  async findAllWithPagination(filter = {}, page = 1, limit = 10, sort = { createdAt: -1 }) {
    const skip = (page - 1) * limit

    const [results, total] = await Promise.all([this.findAll(filter, '', { skip, limit, sort }), this.count(filter)])

    return {
      results,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    }
  }

  /**
   * Tìm kiếm chuyến đi theo địa điểm và thời gian
   */
  async checkExistingTrip(startLocation, endLocation, startTime, endTime) {
    return this.findOne({
      startLocation,
      endLocation,
      startTime: { $gte: startTime },
      endTime: { $lte: endTime },
      carCompanyId: { $ne: null }
    })
  }
}
const tripRespository = new TripRespository()
export default tripRespository
