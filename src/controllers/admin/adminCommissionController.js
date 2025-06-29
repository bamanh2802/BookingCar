import { commissionService } from '~/services/commissionService'
import ApiResponse from '~/utils/ApiResponse'
import { catchAsync } from '~/utils/catchAsync'

/**
 * Lấy danh sách hoa hồng (Admin)
 */
const getCommissions = catchAsync(async (req, res) => {
  const { page = 1, limit = 10, search, userId, status, startDate, endDate } = req.query

  const filter = {}

  if (search) {
    filter.$or = [{ description: { $regex: search, $options: 'i' } }]
  }

  if (userId) {
    filter.userId = userId
  }

  if (status) {
    filter.status = status
  }

  if (startDate && endDate) {
    filter.createdAt = {
      $gte: new Date(startDate),
      $lte: new Date(endDate)
    }
  } else if (startDate) {
    filter.createdAt = { $gte: new Date(startDate) }
  } else if (endDate) {
    filter.createdAt = { $lte: new Date(endDate) }
  }

  const commissions = await commissionService.getCommissions(filter, parseInt(page), parseInt(limit))
  return res.status(200).json(ApiResponse.success(commissions, 'Lấy danh sách hoa hồng thành công'))
})

/**
 * Tạo hoa hồng mới (Admin)
 */
const createCommission = catchAsync(async (req, res) => {
  const createdCommission = await commissionService.createCommission(req.body)
  return res.status(201).json(ApiResponse.created(createdCommission, 'Tạo hoa hồng thành công'))
})

/**
 * Cập nhật thông tin hoa hồng (Admin)
 */
const updateCommission = catchAsync(async (req, res) => {
  const { commissionId } = req.params
  const updatedCommission = await commissionService.updateCommission(commissionId, req.body)
  return res.status(200).json(ApiResponse.success(updatedCommission, 'Cập nhật thông tin hoa hồng thành công'))
})

/**
 * Lấy thông tin hoa hồng theo ID (Admin)
 */
const getCommissionById = catchAsync(async (req, res) => {
  const { commissionId } = req.params
  const commission = await commissionService.getCommissionById(commissionId)
  return res.status(200).json(ApiResponse.success(commission, 'Lấy thông tin hoa hồng thành công'))
})

/**
 * Xóa hoa hồng (Admin)
 */
const deleteCommission = catchAsync(async (req, res) => {
  const { commissionId } = req.params
  const result = await commissionService.deleteCommission(commissionId)
  return res.status(200).json(ApiResponse.success(result, 'Xóa hoa hồng thành công'))
})

/**
 * Phê duyệt hoa hồng (Admin)
 */
const approveCommission = catchAsync(async (req, res) => {
  const { commissionId } = req.params
  const { approvalNote } = req.body
  const approvedCommission = await commissionService.updateCommission(commissionId, {
    status: 'Approved',
    approvedBy: req.user._id,
    approvedAt: new Date(),
    approvalNote
  })
  return res.status(200).json(ApiResponse.success(approvedCommission, 'Phê duyệt hoa hồng thành công'))
})

/**
 * Từ chối hoa hồng (Admin)
 */
const rejectCommission = catchAsync(async (req, res) => {
  const { commissionId } = req.params
  const { rejectionReason } = req.body
  const rejectedCommission = await commissionService.updateCommission(commissionId, {
    status: 'Rejected',
    rejectedBy: req.user._id,
    rejectedAt: new Date(),
    rejectionReason
  })
  return res.status(200).json(ApiResponse.success(rejectedCommission, 'Từ chối hoa hồng thành công'))
})

/**
 * Thanh toán hoa hồng (Admin)
 */
const payCommission = catchAsync(async (req, res) => {
  const { commissionId } = req.params
  const { paymentNote, paymentMethod } = req.body
  const paidCommission = await commissionService.updateCommission(commissionId, {
    status: 'Paid',
    paidBy: req.user._id,
    paidAt: new Date(),
    paymentNote,
    paymentMethod
  })
  return res.status(200).json(ApiResponse.success(paidCommission, 'Thanh toán hoa hồng thành công'))
})

/**
 * Lấy danh sách hoa hồng theo người dùng (Admin)
 */
const getCommissionsByUser = catchAsync(async (req, res) => {
  const { userId } = req.params
  const { page = 1, limit = 10 } = req.query

  const commissions = await commissionService.getCommissions({ userId }, parseInt(page), parseInt(limit))
  return res.status(200).json(ApiResponse.success(commissions, 'Lấy danh sách hoa hồng theo người dùng thành công'))
})

/**
 * Lấy thống kê hoa hồng (Admin)
 */
const getCommissionStats = catchAsync(async (req, res) => {
  const { startDate, endDate, userId } = req.query

  const filter = {}
  if (startDate && endDate) {
    filter.createdAt = {
      $gte: new Date(startDate),
      $lte: new Date(endDate)
    }
  }
  if (userId) {
    filter.userId = userId
  }

  const stats = await commissionService.getCommissionStats(filter)
  return res.status(200).json(ApiResponse.success(stats, 'Lấy thống kê hoa hồng thành công'))
})

/**
 * Tính toán hoa hồng cho tất cả đại lý (Admin)
 */
const calculateAllCommissions = catchAsync(async (req, res) => {
  const { month } = req.query
  const result = await commissionService.calculateCommissionsForPeriod(month)
  return res.status(200).json(ApiResponse.success(result, 'Tính toán hoa hồng thành công'))
})

export const adminCommissionController = {
  getCommissions,
  createCommission,
  updateCommission,
  getCommissionById,
  deleteCommission,
  approveCommission,
  rejectCommission,
  payCommission,
  getCommissionsByUser,
  getCommissionStats,
  calculateAllCommissions
}
