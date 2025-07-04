import { tripModel } from '~/models/tripModel'
import BaseRepository from './baseRepository'
import { Types } from 'mongoose'

class TripRespository extends BaseRepository {
  constructor() {
    super(tripModel)
  }

  /**
   * * Tìm kiếm chuyến đi theo ID
   * @param {String} tripId - ID của chuyến đi
   */
  async findTripById(tripId) {
    return this.findById(tripId)
  }

  /**
   * * Lấy thông tin chi tiết chuyến đi theo ID
   * @param {String} tripId - ID của chuyến đi
   */
  async findDetailTripById(id) {
    const pipeline = [
      { $match: { _id: new Types.ObjectId(id) } },

      // Join carcompanies và chỉ lấy các trường cần thiết
      {
        $lookup: {
          from: 'carcompanies',
          let: { carCompanyId: '$carCompanyId' },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ['$_id', '$$carCompanyId'] }
              }
            }
          ],
          as: 'carCompanyInfo'
        }
      },
      { $unwind: '$carCompanyInfo' },

      // Join seatmaps và chỉ lấy các trường cần thiết
      {
        $lookup: {
          from: 'seatmaps',
          let: { seatMapId: '$seatMapId' },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ['$_id', '$$seatMapId'] }
              }
            },
            {
              $project: {
                seats: 1,
                totalBookedSeats: 1
              }
            }
          ],
          as: 'bookedSeats'
        }
      },
      { $unwind: '$bookedSeats' }
    ]

    const result = await this.model.aggregate(pipeline)
    return result[0] || null
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
  async findAllTripWithPagination(filter = {}, page = 1, limit = 10, sort = { createdAt: -1 }) {
    const skip = (page - 1) * limit

    const pipeline = [
      { $match: filter },
      { $sort: sort },
      { $skip: skip },
      { $limit: limit },
      {
        $lookup: {
          from: 'carcompanies',
          let: { carCompanyId: '$carCompanyId' },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ['$_id', '$$carCompanyId'] }
              }
            }
          ],
          as: 'carCompanyInfo'
        }
      },
      { $unwind: { path: '$carCompanyInfo', preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: 'seatmaps',
          let: { seatMapId: '$seatMapId' },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ['$_id', '$$seatMapId'] }
              }
            },
            {
              $project: {
                seats: 1,
                totalBookedSeats: 1
              }
            }
          ],
          as: 'bookedSeats'
        }
      },
      { $unwind: { path: '$bookedSeats', preserveNullAndEmptyArrays: true } }
      // Có thể thêm $project ở đây nếu muốn
    ]

    const results = await this.model.aggregate(pipeline)
    const total = await this.count(filter)
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
  async checkExistingTrip(startLocation, endLocation, startTime, endTime, carCompanyId) {
    return this.findOne({
      startLocation,
      endLocation,
      startTime: { $gte: startTime },
      endTime: { $lte: endTime },
      carCompanyId
    })
  }
}
const tripRespository = new TripRespository()
export default tripRespository
