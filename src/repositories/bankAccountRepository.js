import { bankAccountModel } from '~/models/bankAccountModel'
import BaseRepository from './baseRepository'
import { Types } from 'mongoose'

class BankAccountRepository extends BaseRepository {
  constructor() {
    super(bankAccountModel)
  }

  /**
   * Lấy thông tin tài khoản ngân hàng theo userId
   * @param {string} userId - ID của người dùng
   */
  async getBankAccountsByUserId(userId) {
    const pipeline = [
      { $match: { userId: new Types.ObjectId(userId) } },
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'userInfo'
        }
      },
      { $unwind: '$userInfo' },
      {
        $project: {
          'userInfo._id': 1,
          'userInfo.email': 1,
          'userInfo.fullName': 1,
          'userInfo.phone': 1,
          'userInfo.roleId': 1,
          bankName: 1,
          accountNumber: 1,
          accountHolderName: 1,
          isVerified: 1,
          verificationNote: 1
        }
      }
    ]
    const results = await this.model.aggregate(pipeline)
    return results[0] || null
  }

  /**
   * Lấy thông tin tài khoản ngân hàng theo bộ lọc và phân trang
   * @param {Object} filter - Bộ lọc để tìm kiếm tài khoản ngân hàng
   */
  async getAllBankAccounts(filter = {}, page = 1, limit = 10, sort = { createdAt: -1 }) {
    const pipeline = [
      { $match: filter },
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
      { $unwind: '$userInfo' },
      {
        $project: {
          'userInfo._id': 1,
          'userInfo.email': 1,
          'userInfo.fullName': 1,
          'userInfo.phone': 1,
          'userInfo.roleId': 1,
          bankName: 1,
          accountNumber: 1,
          accountHolderName: 1,
          isVerified: 1,
          verificationNote: 1
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
   * Cập nhật trạng thái xác minh tài khoản ngân hàng
   * @param {string} accountId - ID của tài khoản ngân hàng
   * @param {Object} updateData - Dữ liệu cập nhật
   */
  async updateVerificationStatus(accountId, updateData) {
    const { isVerified, verificationNote } = updateData
    const updateFields = {
      isVerified,
      verificationNote: verificationNote || ''
    }
    return this.updateById(accountId, updateFields)
  }

  /**
   * Xóa tài khoản ngân hàng theo ID
   * @param {string} accountId - ID của tài khoản ngân hàng
   */
  async deleteBankAccount(accountId) {
    return this.deleteById(accountId)
  }

  /**
   * Cập nhật thông tin tài khoản ngân hàng
   * @param {string} accountId - ID của tài khoản ngân hàng
   */
  async updateBankAccount(accountId, updateData) {
    const { bankName, accountNumber, accountHolderName } = updateData
    const updateFields = {
      bankName,
      accountNumber,
      accountHolderName
    }
    return this.updateById(accountId, updateFields)
  }

  /**
   * Tạo mới tài khoản ngân hàng
   * @param {Object} bankAccountData - Dữ liệu tài khoản ngân hàng
   */
  async createBankAccount(bankAccountData) {
    const { userId, bankName, accountNumber, accountHolderName } = bankAccountData
    const newBankAccount = {
      userId: new Types.ObjectId(userId),
      bankName,
      accountNumber,
      accountHolderName,
      isVerified: false,
      verificationNote: ''
    }
    return this.create(newBankAccount)
  }

  /**
   * Kiểm tra xem tài khoản ngân hàng đã tồn tại cho người dùng hay chưa
   * @param {string} userId - ID của người dùng
   */
  async exists(userId) {
    const account = await this.getBankAccountsByUserId(userId)
    return !!account
  }

  /**
   * Lấy thống kê tài khoản ngân hàng
   */
  async getStats() {
    const total = await this.count()
    const verified = await this.count({ isVerified: true })
    const unverified = await this.count({ isVerified: false })
    
    return {
      total,
      verified,
      unverified,
      verificationRate: total > 0 ? Math.round((verified / total) * 100) : 0
    }
  }

  /**
   * Lấy danh sách ngân hàng phổ biến
   */
  async getPopularBanks() {
    const pipeline = [
      {
        $group: {
          _id: '$bankName',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 },
      {
        $project: {
          bankName: '$_id',
          count: 1,
          _id: 0
        }
      }
    ]
    return this.model.aggregate(pipeline)
  }
}

const bankAccountRepository = new BankAccountRepository()

export default bankAccountRepository
