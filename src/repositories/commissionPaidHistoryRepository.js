import { commissionPaidHistoryModel } from '~/models/commissionPaidHistory'
import BaseRepository from './baseRepository.js'
import { REFUND_STATUS } from '~/constants/index.js'
import { getReportTimeInfo } from '~/utils/timeTranfer.js'
class CommissionPaidHistoryRepository extends BaseRepository {
  constructor() {
    super(commissionPaidHistoryModel)
  }

  /**
   * Lưu lịch sử hoa hồng đã trả
   * @param {Object} data - Dữ liệu lịch sử hoa hồng
   * @returns {Promise<Object>} - Lịch sử hoa hồng đã lưu
   */
  async saveCommissionPaidHistory(data) {
    const commissionPaidHistory = new this.model(data)
    return await commissionPaidHistory.save()
  }

  /**
   * Lấy danh sách lịch sử hoa hồng đã trả với phân trang
   * @param {Object} filter - Bộ lọc tìm kiếm
   * @param {number} page - Số trang
   * @param {number} limit - Số lượng bản ghi mỗi trang
   * @returns {Promise<Object>} - Danh sách lịch sử hoa hồng đã trả
   */
  async getCommissionPaidHistoryWithPagination(filter = {}, page = 1, limit = 10) {
    const skip = (page - 1) * limit
    const pipeline = [
      { $match: filter },
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'userInfo'
        }
      },
      {
        $lookup: {
          from: 'userroles',
          localField: 'roleId',
          foreignField: '_id',
          as: 'roleInfo'
        }
      },
      { $unwind: '$userInfo' },
      { $unwind: '$roleInfo' },
      {
        $project: {
          _id: 1,
          userId: '$userInfo._id',
          userName: '$userInfo.name',
          roleId: '$roleInfo._id',
          roleName: '$roleInfo.roleName',
          amount: 1,
          ticketId: 1,
          createdAt: 1
        }
      },
      { $sort: { createdAt: -1 } }, // Sắp xếp theo ngày tạo mới nhất
      { $skip: skip },
      { $limit: limit }
    ]

    const results = await this.model.aggregate(pipeline)
    const total = await this.model.countDocuments(filter)
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
   * Lấy lịch sử hoa hồng đã trả theo ID
   * @param {string} id - ID của lịch sử hoa hồng
   * @returns {Promise<Object>} - Lịch sử hoa hồng đã trả
   */
  async getCommissionPaidHistoryById(id) {
    const pipeline = [
      { $match: { _id: id } },
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'userInfo'
        }
      },
      {
        $lookup: {
          from: 'userroles',
          localField: 'roleId',
          foreignField: '_id',
          as: 'roleInfo'
        }
      },
      { $unwind: '$userInfo' },
      { $unwind: '$roleInfo' },
      {
        $project: {
          _id: 1,
          userId: '$userInfo._id',
          userName: '$userInfo.name',
          roleId: '$roleInfo._id',
          roleName: '$roleInfo.roleName',
          amount: 1,
          ticketId: 1,
          createdAt: 1
        }
      }
    ]
    const result = await this.model.aggregate(pipeline)
    if (result.length === 0) {
      throw new Error('Lịch sử hoa hồng không tồn tại')
    }
    return result[0]
  }

  /**
   * Tính toán hoa hồng cho khoảng thời gian
   */
  async calculateForPeriod({ startDate, endDate }) {
    const pipeline = [
      {
        $match: {
          status: REFUND_STATUS.COMPLETED,
          createdAt: {
            $gte: startDate,
            $lte: endDate
          }
        }
      },
      {
        $group: {
          _id: null,
          totalCalculated: { $sum: '$amount' },
          totalComissions: { $sum: 1 }
        }
      },

      {
        $project: {
          _id: 0
        }
      }
    ]

    const result = await this.model.aggregate(pipeline)
    return (
      result[0] || {
        totalCalculated: 0,
        totalCommissions: 0
      }
    )
  }
}

// Singleton instance of CommissionPaidHistoryRepository
const commissionPaidHistoryRepository = new CommissionPaidHistoryRepository()
export default commissionPaidHistoryRepository
