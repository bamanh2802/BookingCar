import { quickActionModel } from '~/models/quickActionModel'
import BaseRepository from './baseRepository'
class QuickActionRepository extends BaseRepository {
  constructor() {
    super(quickActionModel)
  }

  async getAllQuickAction(filter = {}, page = 1, limit = 10, search = '', sort = { createdAt: -1 }) {
    const matchStage = { ...filter }

    // Nếu có search, áp dụng $regex vào phone (có thể mở rộng thêm field)
    if (search) {
      matchStage.$or = [
        { phone: { $regex: search, $options: 'i' } },
        { title: { $regex: search, $options: 'i' } } // bạn có thể thêm các field khác ở đây
      ]
    }

    const pipeline = [
      { $match: matchStage },
      { $sort: sort },
      { $skip: (page - 1) * limit },
      { $limit: limit },

      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'userInfo'
        }
      },
      { $unwind: { path: '$userInfo', preserveNullAndEmptyArrays: true } },
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

    // Đếm tổng số lượng (áp dụng cả search nếu có)
    const countFilter = { ...filter }
    if (search) {
      countFilter.$or = [{ phone: { $regex: search, $options: 'i' } }, { title: { $regex: search, $options: 'i' } }]
    }

    const total = await this.model.countDocuments(countFilter)

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
