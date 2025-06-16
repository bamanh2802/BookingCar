import { ticketModel } from '~/models/ticketModel'
import BaseRepository from './baseRepository'
import { Types } from 'mongoose'
import { DOCUMENT_NAMES } from '~/constants'

class TicketRequestRepository extends BaseRepository {
  constructor() {
    super(ticketModel)
  }
  /**
   * Tạo vé mới
   * @param {Object} ticketData - Dữ liệu vé
   */
  async createTicket(ticketData) {
    return this.create(ticketData)
  }
  /**
   * Tìm vé theo ID
   */
  async findTicketById(ticketId) {
    return this.findOne({ _id: ticketId })
  }

  /**
   * Lấy thông tin vé
   */
  async getTicketDetail(id) {
    const pipeline = [
      { $match: { _id: new Types.ObjectId(id) } },
      {
        $lookup: {
          from: 'users',
          let: { userId: '$userId' },
          pipeline: [
            {
              $match: { $expr: { $eq: ['$_id', '$$userId'] } }
            },
            {
              $lookup: {
                from: 'users',
                let: { parentId: '$parentId' },
                pipeline: [
                  {
                    $match: { $expr: { $eq: ['$_id', '$$parentId'] } }
                  },
                  {
                    $project: {
                      email: 1,
                      fullName: 1,
                      phone: 1
                    }
                  }
                ],
                as: 'parentInfo'
              }
            },
            {
              $unwind: {
                path: '$parentInfo',
                preserveNullAndEmptyArrays: true
              }
            },
            {
              $project: {
                email: 1,
                fullName: 1,
                phone: 1,
                roleId: 1,
                parentInfo: 1
              }
            }
          ],
          as: 'userInfor'
        }
      },
      { $unwind: '$userInfor' },

      // Lookup tripInfo
      {
        $lookup: {
          from: 'trips',
          let: { tripId: '$tripId' },
          pipeline: [
            {
              $match: { $expr: { $eq: ['$_id', '$$tripId'] } }
            }
          ],
          as: 'tripInfo'
        }
      },
      { $unwind: '$tripInfo' },

      // Lookup carCompanyInfo trực tiếp sau khi đã có tripInfo
      {
        $lookup: {
          from: 'carcompanies',
          let: { carCompanyId: '$tripInfo.carCompanyId' },
          pipeline: [
            {
              $match: { $expr: { $eq: ['$_id', '$$carCompanyId'] } }
            },
            {
              $project: { seatMap: 0 }
            }
          ],
          as: 'carCompanyInfo'
        }
      },
      { $unwind: '$carCompanyInfo' }
    ]

    const result = await this.model.aggregate(pipeline)
    return result[0] || null
  }

  /**
   * Cập nhật vé
   * @param {String} ticketId - ID của vé
   * @param {Object} updateData - Dữ liệu cập nhật
   */
  async updateTicket(ticketId, updateData) {
    return this.updateById(ticketId, updateData)
  }

  /**
   * Xóa vé
   * @param {String} ticketId - ID của vé
   */
  async deleteTicket(ticketId) {
    return this.deleteById(ticketId)
  }

  /**
   * Tìm vé theo bộ lọc với phân trang
   * @param {Object} filter - Bộ lọc để tìm kiếm vé
   * @param {number} page - Số trang hiện tại
   * @param {number} limit - Số lượng vé trên mỗi trang
   * @returns {Object} Danh sách vé và thông tin phân trang
   */

  async findTicketsWithPagination(filter = {}, page = 1, limit = 10, sort = { createdAt: -1 }) {
    return this.findWithPagination(filter, page, limit, sort)
  }

  /**
   * Kiểm tra xem vé có tồn tại không
   * @param {String} ticketId - ID của vé
   */
  async exists(ticketId) {
    const ticket = await this.findTicketById(ticketId)
    return !!ticket
  }

  /**
   * Tìm vé theo ID người dùng
   * @param {String} userId - ID của người dùng
   *
   * @return {Array} Danh sách vé của người dùng
   */
  async findTicketsByUserId(userId) {
    return this.findAll({ userId })
  }

  /**
   * Tìm vé theo ID chuyến đi và phân trang
   * @param {String} tripId - ID của chuyến đi
   * @param {number} page - Số trang hiện tại
   * @param {number} limit - Số lượng vé trên mỗi trang
   * @return {Array} Danh sách vé của chuyến đi
   * */
  async findTicketsByTripIdWithPagination(tripId, page = 1, limit = 10) {
    const filter = { tripId }
    return this.findWithPagination(filter, page, limit)
  }

  /**
   * Tìm vé theo ID người dùng và ID chuyến đi
   * @param {String} userId - ID của người dùng
   * @param {String} tripId - ID của chuyến đi
   * @return {Array} Danh sách vé của người dùng cho chuyến đi
   */
  async findTicketByUserIdAndTripId(userId, tripId) {
    return this.findOne({ userId, tripId })
  }

  /**
   * Tìm vé theo ID người dùng và phân trang
   * @param {String} userId - ID của người dùng
   * @param {number} page - Số trang hiện tại
   * @param {number} limit - Số lượng vé trên mỗi trang
   */
  async findTicketsByUserIdWithPagination(userId, page = 1, limit = 10) {
    const filter = { userId }
    return this.findWithPagination(filter, page, limit)
  }
}

const ticketRepository = new TicketRequestRepository()
export default ticketRepository
