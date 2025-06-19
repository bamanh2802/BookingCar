import { Types } from 'mongoose'
import BaseRepository from './baseRepository.js'
import { ticketRequestModel } from '~/models/ticketRequestModel.js'

class TicketRequestRepository extends BaseRepository {
  constructor() {
    super(ticketRequestModel)
  }

  /**
   * Tạo yêu cầu vé mới
   * @param {Object} ticketRequestData - Dữ liệu yêu cầu vé
   */
  async createTicketRequest(ticketRequestData) {
    return this.create(ticketRequestData)
  }
  /**
   * Tìm kiếm yêu cầu vé theo ID
   * @param {String} ticketRequestId - ID của yêu cầu vé
   */
  async findTicketRequestById(ticketRequestId) {
    const pipeline = [
      { $match: { _id: new Types.ObjectId(ticketRequestId) } },
      {
        $lookup: {
          from: 'trips',
          localField: 'tripId',
          foreignField: '_id',
          as: 'tripInfo'
        }
      },
      { $unwind: '$tripInfo' },
      {
        $lookup: {
          from: 'carcompanies',
          localField: 'tripInfo.carCompanyId',
          foreignField: '_id',
          as: 'carCompanyInfo'
        }
      },
      { $unwind: '$carCompanyInfo' },
      {
        $project: {
          'carCompanyInfo.seatMap': 0
        }
      }
    ]

    const result = await this.model.aggregate(pipeline)

    // Vì chỉ truy vấn 1 ticketRequest theo id → nên lấy phần tử đầu tiên
    return result[0] || []
  }

  /**
   * Cập nhật yêu cầu vé
   * @param {String} ticketRequestId - ID của yêu cầu vé
   * @param {Object} updateData - Dữ liệu cập nhật
   */
  async updateTicketRequest(ticketRequestId, updateData) {
    return this.updateById(ticketRequestId, updateData)
  }
  /**
   * Xóa yêu cầu vé
   * @param {String} ticketRequestId - ID của yêu cầu vé
   */
  async deleteTicketRequest(ticketRequestId) {
    return this.deleteById(ticketRequestId)
  }

  /**
   * Tìm kiếm yêu cầu vé theo bộ lọc với phân trang
   * @param {Object} filter - Bộ lọc để tìm kiếm yêu cầu vé
   * @param {number} page - Số trang hiện tại
   * @param {number} limit - Số lượng yêu cầu vé trên mỗi trang
   * @returns {Object} Danh sách yêu cầu vé và thông tin phân trang
   */
  async findTicketRequestsWithPagination(filter = {}, page = 1, limit = 10, sort = { createdAt: -1 }) {
    const pipeline = [
      { $match: filter },
      { $sort: sort },
      { $skip: (page - 1) * limit },
      { $limit: limit },
      {
        $lookup: {
          from: 'trips',
          localField: 'tripId',
          foreignField: '_id',
          as: 'tripInfo'
        }
      },
      { $unwind: { path: '$tripInfo', preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: 'carcompanies',
          localField: 'tripInfo.carCompanyId',
          foreignField: '_id',
          as: 'carCompanyInfo'
        }
      },
      { $unwind: { path: '$carCompanyInfo', preserveNullAndEmptyArrays: true } },
      {
        $project: {
          'carCompanyInfo.seatMap': 0
        }
      }
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
   * Kiểm tra xem yêu cầu vé có tồn tại không
   * @param {String} ticketRequestId - ID của yêu cầu vé
   */
  async exists(ticketRequestId) {
    const ticketRequest = await this.findTicketRequestById(ticketRequestId)
    return !!ticketRequest
  }

  /**
   * Tìm kiếm yêu cầu vé theo ID người dùng và phân trang
   * @param {String} userId - ID của người dùng
   */
  async findTicketRequestsByUserId(userId, page = 1, limit = 10) {
    const filter = { userId: new Types.ObjectId(userId) }
    return this.findTicketRequestsWithPagination(filter, page, limit)
  }

  /**
   * Tìm kiếm yêu cầu vé theo ID chuyến đi và phân trang
   * @param {String} tripId - ID của chuyến đi
   */
  async findTicketRequestsByTripId(tripId, page = 1, limit = 10) {
    const filter = { tripId: new Types.ObjectId(tripId) }
    return this.findTicketRequestsWithPagination(filter, page, limit)
  }

  /**
   * Tìm kiếm yêu cầu vé theo ID người dùng và ID chuyến đi
   * @param {String} userId - ID của người dùng
   * @param {String} tripId - ID của chuyến đi
   */
  async findTicketRequestByUserIdAndTripId(userId, tripId) {
    return this.findOne({ userId, tripId })
  }
}

// Tạo một instance của TicketRequestRepository
const ticketRequestRepository = new TicketRequestRepository()
export default ticketRequestRepository
