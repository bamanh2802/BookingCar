import { ticketModel } from '~/models/ticketModel'
import BaseRepository from './baseRepository'
import { Types } from 'mongoose'
import { TICKET_STATUS, USER_ROLES } from '~/constants'
import { getReportTimeInfo } from '~/utils/timeTranfer'
import { fillMissingChartData } from '~/utils/algorithms'

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
    return this.findOne({ _id: new Types.ObjectId(ticketId) })
  }

  /**
   * Tìm toàn bộ vé theo ID chuyến đi
   * @param {String} tripId - ID của chuyến đi
   */
  async findTicketsByTripId(tripId, filter) {
    return this.findAll({ tripId, ...filter })
  }

  /**
   * Lấy thông tin vé
   */
  async getTicketDetail(id) {
    // Kiểm tra ObjectId hợp lệ
    if (!Types.ObjectId.isValid(id)) return null
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
      { $unwind: { path: '$userInfor', preserveNullAndEmptyArrays: true } },

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
      { $unwind: { path: '$tripInfo', preserveNullAndEmptyArrays: true } },

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
      { $unwind: { path: '$carCompanyInfo', preserveNullAndEmptyArrays: true } }

      // Project cuối để loại bỏ các trường không cần thiết (nếu muốn)
      // { $project: { ... } }
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
    const matchConditions = []

    const convertToObjectId = (val) => {
      if (Array.isArray(val)) return val.map((v) => new Types.ObjectId(v))
      return [new Types.ObjectId(val)]
    }

    const orConditions = []

    if (filter.createdBy) {
      orConditions.push({
        createdBy: {
          $in: convertToObjectId(filter.createdBy)
        }
      })
    }

    if (filter.userId) {
      orConditions.push({
        userId: {
          $in: convertToObjectId(filter.userId)
        }
      })
    }

    if (orConditions.length > 0) {
      matchConditions.push({ $or: orConditions })
    }

    // Các điều kiện khác (ngoại trừ createdBy, userId)
    const otherFilters = { ...filter }
    delete otherFilters.createdBy
    delete otherFilters.userId

    if (Object.keys(otherFilters).length > 0) {
      matchConditions.push(otherFilters)
    }

    const matchFilter = matchConditions.length > 0 ? { $and: matchConditions } : {}

    const results = await this.model.aggregate([
      { $match: matchFilter },
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
        $lookup: {
          from: 'users',
          localField: 'createdBy',
          foreignField: '_id',
          as: 'creatorInfo'
        }
      },
      { $unwind: { path: '$creatorInfo', preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: 'userroles',
          localField: 'creatorInfo.roleId',
          foreignField: '_id',
          as: 'creatorRole'
        }
      },
      { $unwind: { path: '$creatorRole', preserveNullAndEmptyArrays: true } },
      {
        $project: {
          'carCompanyInfo.seatMap': 0,
          'creatorRole.permissions': 0,
          'creatorRole.createdAt': 0,
          'creatorRole.updatedAt': 0,
          'creatorRole.__v': 0,
          'creatorRole.inherits': 0,

          __v: 0
        }
      }
    ])

    const total = await this.count(matchFilter)

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
  async findTicketsByTripIdWithPagination(tripId, page = 1, limit = 10, sort = { createdAt: -1 }) {
    const filter = { tripId: new Types.ObjectId(tripId) }
    const results = await this.model.aggregate([
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
    ])
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
   * Tìm vé theo ID người dùng và ID chuyến đi
   * @param {String} userId - ID của người dùng
   * @param {String} tripId - ID của chuyến đi
   * @return {Array} Danh sách vé của người dùng cho chuyến đi
   */
  async findTicketByUserIdAndTripId(userId, tripId) {
    return this.findOne({ userId, tripId, status: { $ne: TICKET_STATUS.CANCELLED } })
  }

  /**
   * Tìm vé theo ID người dùng và phân trang
   * @param {String} userId - ID của người dùng
   * @param {number} page - Số trang hiện tại
   * @param {number} limit - Số lượng vé trên mỗi trang
   */
  async findTicketsByUserIdWithPagination(userId, page = 1, limit = 10) {
    const filter = { userId: new Types.ObjectId(userId) }
    const results = await this.model.aggregate([
      { $match: filter },
      { $sort: { createdAt: -1 } },
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
    ])

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
  //Lấy doanh thu cho admin
  async getRevenueStatsByRole(filter, period) {
    const timeInfo = getReportTimeInfo(period || '7days')
    if (!timeInfo) {
      throw new Error('Invalid period provided for report.')
    }

    const { utcDateRange, groupingInfo } = timeInfo
    const { groupByFormat, timezone, labels: allLabels } = groupingInfo

    const pipeline = [
      {
        $match: {
          ...filter,
          status: TICKET_STATUS.DONE,
          createdAt: {
            $gte: utcDateRange.startDate,
            $lte: utcDateRange.endDate
          }
        }
      },
      {
        // Tính số ghế (seats.length) cho mỗi ticket
        $project: {
          createdAt: 1,
          price: 1,
          seatCount: { $size: '$seats' }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: groupByFormat,
              date: '$createdAt',
              timezone
            }
          },
          totalRevenue: { $sum: '$price' },
          totalTickets: { $sum: '$seatCount' }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]

    const chartDataRaw = await this.model.aggregate(pipeline)

    // Bổ sung dữ liệu trống nếu có tuần/ngày/tháng nào không có data
    const chartData = fillMissingChartData(chartDataRaw, allLabels)

    // Tính tổng toàn kỳ
    const totals = chartData.reduce(
      (acc, item) => {
        acc.totalRevenue += item.totalRevenue
        acc.totalTickets += item.totalTickets
        return acc
      },
      { totalRevenue: 0, totalTickets: 0 }
    )

    return { ...totals, chartData }
  }

  async getRevenueTicketType({ startDate, endDate }) {
    const pipeline = [
      {
        $match: {
          status: TICKET_STATUS.DONE,
          createdAt: {
            $gte: startDate,
            $lte: endDate
          }
        }
      },
      {
        $project: {
          type: 1,
          price: 1,
          seatCount: { $size: '$seats' }
        }
      },
      {
        $group: {
          _id: '$type',
          totalRevenue: { $sum: '$price' },
          ticketSold: { $sum: '$seatCount' }
        }
      },
      {
        $project: {
          _id: 0,
          ticketType: '$_id',
          totalRevenue: 1,
          ticketSold: 1
        }
      },
      {
        $sort: { totalRevenue: -1 }
      }
    ]

    const result = await this.model.aggregate(pipeline)
    return result || []
  }

  async getTopAgentLv1Report({ startDate, endDate, limit }) {
    const pipeline = [
      {
        $match: {
          status: TICKET_STATUS.DONE,
          createdBy: { $exists: true, $ne: null },
          createdAt: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'createdBy',
          foreignField: '_id',
          as: 'creatorInfo'
        }
      },
      {
        $unwind: '$creatorInfo' // ✅ Đúng tên
      },
      {
        $project: {
          price: 1,
          seatCount: { $size: '$seats' },
          creatorInfo: 1 // giữ lại để dùng trong $addFields
        }
      },
      {
        $addFields: {
          revenueOwnerId: {
            $cond: {
              if: { $eq: ['$creatorInfo.roleName', USER_ROLES.AGENT_LV1] },
              then: '$creatorInfo._id',
              else: '$creatorInfo.parentId'
            }
          }
        }
      },
      {
        $match: { revenueOwnerId: { $ne: null } }
      },
      {
        $group: {
          _id: '$revenueOwnerId',
          totalRevenue: { $sum: '$price' },
          ticketSold: { $sum: '$seatCount' }
        }
      },
      {
        $sort: { totalRevenue: -1 }
      },
      {
        $limit: limit
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'agentLv1Details'
        }
      },
      {
        $unwind: '$agentLv1Details'
      },
      {
        $project: {
          _id: 0,
          agentId: '$_id',
          agentName: '$agentLv1Details.fullName',
          agentEmail: '$agentLv1Details.email',
          totalRevenue: 1,
          ticketSold: 1
        }
      }
    ]

    const result = await this.model.aggregate(pipeline)
    return result || []
  }
}

const ticketRepository = new TicketRequestRepository()
export default ticketRepository
