import { seatMapModel } from '~/models/seatMapModel'
import BaseRepository from './baseRepository'
class SeatMapRepository extends BaseRepository {
  constructor() {
    super(seatMapModel)
  }

  /**
   * Tìm kiếm bản đồ ghế theo ID chuyến đi
   * @param {String} tripId - ID của chuyến đi
   */
  async findByTripId(tripId) {
    return this.findOne({ tripId })
  }

  /**
   * Tìm kiếm bản đồ ghế theo carCompanyID
   * @param {String} carCompanyId - ID của công ty xe
   */
  async findByCarCompanyId(carCompanyId) {
    return this.findOne({ carCompanyId })
  }

  /**
   * Tìm kiếm bản đồ ghế theo code
   * @param {String} code - Mã của bản đồ ghế
   */
  async findByCode(code) {
    return this.findOne({ code })
  }

  /**
   * Tạo bản đồ ghế mới
   * @param {Object} seatMapData - Dữ liệu bản đồ ghế
   */
  async createSeatMap(seatMapData) {
    return this.create(seatMapData)
  }

  /**
   * Cập nhật bản đồ ghế
   * @param {String} seatMapId - ID của bản đồ ghế
   * @param {Object} updateData - Dữ liệu cập nhật
   */
  async updateSeatMap(seatMapId, updateData) {
    return this.updateById(seatMapId, updateData)
  }

  /**
   * Xóa bản đồ ghế
   * @param {String} seatMapId - ID của bản đồ ghế
   */

  async deleteSeatMap(seatMapId) {
    return this.deleteById(seatMapId)
  }

  /**
   * Kiểm tra xem bản đồ ghế có tồn tại không
   * @param {String} tripId - ID của chuyến đi
   */

  async existsByTripId(tripId) {
    return this.exists({ tripId })
  }
}

// Singleton instance of SeatMapRepository
const seatMapRepository = new SeatMapRepository()
export default seatMapRepository
