import { referralCodeModel } from '~/models/referralCodeModel'
import BaseRepository from './baseRepository'

class ReferralCodeRepository extends BaseRepository {
  constructor() {
    super(referralCodeModel)
  }

  async findByCode(code) {
    return this.model.findOne({ code, isActive: true }).exec()
  }

  async findByUserId(userId) {
    return this.model.find({ userId }).exec()
  }

  async createReferralCode(data) {
    return this.model.create(data)
  }

  async deactivateCode(code) {
    return this.model.findOneAndUpdate({ code }, { isActive: false }, { new: true }).exec()
  }
}

export const referralCodeRepository = new ReferralCodeRepository() 