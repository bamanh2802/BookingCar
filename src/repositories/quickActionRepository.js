import { quickActionModel } from '~/models/quickActionModel'
import BaseRepository from './baseRepository'
class QuickActionRepository extends BaseRepository {
  constructor() {
    super(quickActionModel)
  }

  async getAllQuickAction(filter = {}, page = 1, limit = 10, sort = { createdAt: -1 }) {
    const pipeline = [
      { $match: filter },
      { $sort: sort },
      { $skip: (page - 1) * limit },
      { $limit: limit },

      // Join với bảng users
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'userInfo'
        }
      },

      { $unwind: { path: '$userInfo', preserveNullAndEmptyArrays: true } },

      // (tuỳ chọn) chỉ lấy các trường cần thiết
      {
        $project: {
          title: 1,
          createdAt: 1,
          userId: 1,
          phone: 1,
          isDone: 1,
          'userInfo._id': 1,
          'userInfo.name': 1,
          'userInfo.email': 1
        }
      }
    ]

    const docs = await this.model.aggregate(pipeline)
    // Tổng số lượng (nếu cần)
    const total = await this.model.countDocuments(filter)

    return {
      docs,
      total,
      page,
      limit
    }
  }
}

const quickActionRepository = new QuickActionRepository()

export default quickActionRepository
