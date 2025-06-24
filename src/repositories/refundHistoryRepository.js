import { refundHistoryModel } from '~/models/refundHistoryModel'
import BaseRepository from './baseRepository'

class RefundHistoryRepository extends BaseRepository {
  constructor() {
    super(refundHistoryModel)
  }

  async createRefundHistory(data, session = null) {
    return this.model.create([{ ...data }], session ? { session } : {})
  }

  async findByUserId(userId) {
    return this.model.find({ userId })
  }
}

const refundHistoryRepository = new RefundHistoryRepository()
export default refundHistoryRepository
