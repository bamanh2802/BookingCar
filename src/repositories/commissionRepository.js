import { commissionModel } from '~/models/commissionModel'
import BaseRepository from './baseRepository'
class CommissionRepository extends BaseRepository {
  constructor() {
    super(commissionModel)
  }

  /**
   * Tìm kiếm hoa hồng theo roleId
   * @param {string} roleId - ID của role
   */
  async findByRoleId(roleId) {
    return this.findOne({ roleId })
  }

  /**
   * Cập nhật hoa hồng cho role
   * @param {string} roleId - ID của role
   * @param {number} percent - Phần trăm hoa hồng mới
   */
  async updateCommission(roleId, percent) {
    const commission = await this.model.findOneAndUpdate({ roleId }, { $set: { percent } }, { new: true })
    return commission
  }

  /**
   * Kiểm tra xem hoa hồng đã tồn tại cho role hay chưa
   * @param {string} roleId - ID của role
   */
  async exists(roleId) {
    const commission = await this.findByRoleId(roleId)
    return !!commission
  }

  /**
   * Xóa hoa hồng theo roleId
   * @param {string} roleId - ID của role
   * */
  async deleteByRoleId(roleId) {
    const commission = await this.findByRoleId(roleId)
    if (!commission) {
      throw new Error('Hoa hồng không tồn tại cho role này')
    }
    return this.delete(commission._id)
  }

  /**
   * Lấy tất cả hoa hồng và thông tin role
   * @returns {Promise<Array>} - Danh sách hoa hồng với thông tin role
   */
  async getAllCommissionsWithRoles() {
    const result = await this.model.aggregate([
      {
        $lookup: {
          from: 'userroles', // tên collection chứa vai trò (đảm bảo đúng tên!)
          localField: 'roleId',
          foreignField: '_id',
          as: 'roleInfo'
        }
      },
      { $unwind: '$roleInfo' }, // đảm bảo chỉ 1 role mỗi commission
      {
        $project: {
          _id: 1,
          roleId: '$roleInfo._id',
          roleName: '$roleInfo.roleName',
          percent: 1
        }
      }
    ])

    return result
  }

  /**
   * Lấy thông tin hoa hồng chi tiết theo ID
   * @param {string} id - ID của hoa hồng
   */
  async findCommissionById(id) {
    const commission = await this.model.findById(id).populate('roleId', 'roleName').lean()
    if (!commission) {
      throw new Error('Hoa hồng không tồn tại')
    }
    return { ...commission, roleId: commission.roleId._id, roleName: commission.roleId.roleName }
  }
}

const commissionRepository = new CommissionRepository()
export default commissionRepository
