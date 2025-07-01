import { quickActionModel } from '~/models/quickActionModel'
import BaseRepository from './baseRepository'
class QuickActionRepository extends BaseRepository {
  constructor() {
    super(quickActionModel)
  }

  async getAllQuickAction(filter = {}, page = 1, limit = 10, sort = { createdAt: -1 }) {
    return this.findWithPagination(filter, page, limit, sort)
  }
}

const quickActionRepository = new QuickActionRepository()

export default quickActionRepository
