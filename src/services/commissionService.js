import { REASON_REFUND, REFUND_STATUS } from '~/constants'
import commissionPaidHistoryRepository from '~/repositories/commissionPaidHistoryRepository'
import commissionRepository from '~/repositories/commissionRepository'
import userRepository from '~/repositories/userRepository'
import userRoleRepository from '~/repositories/userRoleRepository'
import ticketRepository from '~/repositories/ticketRepository'
import { ConflictError, NotFoundError } from '~/utils/errors'

const updateCommission = async (roldeId, updateData) => {
  const role = await userRoleRepository.findById(roldeId)
  if (!role) {
    throw new NotFoundError('Không tìm thấy role')
  }

  const commission = await commissionRepository.findByRoleId(roldeId)
  if (!commission) {
    throw new NotFoundError('Không tìm thấy hoa hồng cho role này')
  }

  if (updateData < 0 || updateData > 100) {
    throw new ConflictError('Phần trăm hoa hồng phải nằm trong khoảng từ 0 đến 100')
  }

  const updatedCommission = await commissionRepository.updateCommission(commission.roleId, updateData)
  if (!updatedCommission) {
    throw new NotFoundError('Cập nhật hoa hồng không thành công')
  }
  const data = await commissionRepository.findCommissionById(updatedCommission._id)
  return data
}

const getAllCommissionsWithRoles = async () => {
  const data = await commissionRepository.getAllCommissionsWithRoles()
  return data
}

//Xử lí trả hoa hồng cho người dùng
const payCommissionForTicket = async (ticket, session) => {
  //Lấy thông tin user
  const user = await userRepository.findById(ticket.userId)
  if (!user) {
    throw new NotFoundError('Không tìm thấy người dùng')
  }

  //Lấy thông tin hoa hồng theo role của người dùng
  const commission = await commissionRepository.findByRoleId(user.roleId)
  if (!commission) {
    throw new NotFoundError('Không tìm thấy hoa hồng cho role của người dùng')
  }
  //Tính toán số tiền hoa hồng
  const commissionAmount = (ticket.price * commission.percent) / 100

  //Cập nhật số dư của người dùng
  const increaseBalance = user.amount + commissionAmount
  const updatedUser = await userRepository.updateById(user._id, { amount: increaseBalance }, { session })

  if (!updatedUser) {
    throw new ConflictError('Cập nhật số dư người dùng không thành công')
  }

  //Lưu lịch sử hoa hồng đã trả
  const commissionPaidHistory = {
    userId: user._id,
    roleId: user.roleId,
    amount: commissionAmount,
    ticketId: ticket._id,
    status: REFUND_STATUS.COMPLETED,
    reason: REASON_REFUND.COMMISSION_PAID
  }

  const savedCommissionHistory = await commissionPaidHistoryRepository.saveCommissionPaidHistory(
    commissionPaidHistory,
    { session }
  )
  if (!savedCommissionHistory) {
    throw new ConflictError('Lưu lịch sử hoa hồng không thành công')
  }

  // Nếu có người đặt hộ (createdBy), trả hoa hồng cho người này
  let agencyCommissionResult = null
  if (ticket.createdBy) {
    const agencyUser = await userRepository.findById(ticket.createdBy)
    if (agencyUser) {
      // Lấy thông tin hoa hồng theo role của người đặt hộ
      const agencyCommission = await commissionRepository.findByRoleId(agencyUser.roleId)
      if (agencyCommission) {
        const agencyCommissionAmount = (ticket.price * agencyCommission.percent) / 100
        const agencyNewBalance = (agencyUser.balance || 0) + agencyCommissionAmount
        const updatedAgencyUser = await userRepository.updateById(
          agencyUser._id,
          { balance: agencyNewBalance },
          { session }
        )
        if (!updatedAgencyUser) {
          throw new ConflictError('Cập nhật số dư người đặt hộ không thành công')
        }
        const agencyCommissionPaidHistory = {
          userId: agencyUser._id,
          roleId: agencyUser.roleId,
          amount: agencyCommissionAmount,
          ticketId: ticket._id,
          status: REFUND_STATUS.COMPLETED,
          reason: REASON_REFUND.AGENCY_COMMISSION // Hoa hồng cho người đặt hộ
        }
        const savedAgencyCommissionHistory = await commissionPaidHistoryRepository.saveCommissionPaidHistory(
          agencyCommissionPaidHistory,
          { session }
        )
        if (!savedAgencyCommissionHistory) {
          throw new ConflictError('Lưu lịch sử hoa hồng cho người đặt hộ không thành công')
        }
        agencyCommissionResult = {
          id: updatedAgencyUser._id,
          name: updatedAgencyUser.name,
          balance: updatedAgencyUser.balance,
          commissionPaidHistory: savedAgencyCommissionHistory
        }
      }
    }
  }

  // Cập nhật trạng thái đã trả hoa hồng cho vé
  const updatedTicket = await ticketRepository.updateTicket(ticket._id, { commissionPaid: true }, { session })
  if (!updatedTicket) {
    throw new ConflictError('Cập nhật trạng thái trả hoa hồng cho vé không thành công')
  }

  return {
    user: {
      id: updatedUser._id,
      name: updatedUser.name,
      amount: updatedUser.amount
    },
    commissionPaidHistory: savedCommissionHistory,
    agencyCommission: agencyCommissionResult
  }
}

const getCommissions = async (filter = {}, page = 1, limit = 10) => {
  return await commissionRepository.findWithPagination(filter, page, limit)
}

const createCommission = async (commissionData) => {
  return await commissionRepository.createCommission(commissionData)
}

const getCommissionById = async (commissionId) => {
  const commission = await commissionRepository.findById(commissionId)
  if (!commission) {
    throw new NotFoundError('Không tìm thấy hoa hồng')
  }
  return commission
}

const deleteCommission = async (commissionId) => {
  const commission = await commissionRepository.findById(commissionId)
  if (!commission) {
    throw new NotFoundError('Không tìm thấy hoa hồng')
  }
  return await commissionRepository.deleteById(commissionId)
}

const getCommissionStats = async (filter = {}) => {
  return await commissionRepository.getStats(filter)
}

const calculateCommissionsForPeriod = async (startDate, endDate) => {
  // Logic tính toán hoa hồng cho khoảng thời gian
  return await commissionRepository.calculateForPeriod(startDate, endDate)
}

export const commissionService = {
  updateCommission,
  getAllCommissionsWithRoles,
  payCommissionForTicket,
  getCommissions,
  createCommission,
  getCommissionById,
  deleteCommission,
  getCommissionStats,
  calculateCommissionsForPeriod
}
