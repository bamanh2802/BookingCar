import { bankAccountService } from '~/services/bankAccountService'
import ApiResponse from '~/utils/ApiResponse'
import { catchAsync } from '~/utils/catchAsync'

/**
 * Lấy danh sách tài khoản ngân hàng (Admin)
 */
const getBankAccounts = catchAsync(async (req, res) => {
  const { page = 1, limit = 10, search, userId, bankName, isVerified } = req.query

  const filter = {}
  
  if (search) {
    filter.$or = [
      { accountNumber: { $regex: search, $options: 'i' } },
      { accountName: { $regex: search, $options: 'i' } },
      { bankName: { $regex: search, $options: 'i' } }
    ]
  }

  if (userId) {
    filter.userId = userId
  }

  if (bankName) {
    filter.bankName = { $regex: bankName, $options: 'i' }
  }

  if (isVerified !== undefined) {
    filter.isVerified = isVerified === 'true'
  }

  const bankAccounts = await bankAccountService.getAllBankAccounts(filter, parseInt(page), parseInt(limit))
  return res.status(200).json(ApiResponse.success(bankAccounts, 'Lấy danh sách tài khoản ngân hàng thành công'))
})

/**
 * Tạo tài khoản ngân hàng mới (Admin)
 */
const createBankAccount = catchAsync(async (req, res) => {
  const createdBankAccount = await bankAccountService.createBankAccount(req.body)
  return res.status(201).json(ApiResponse.created(createdBankAccount, 'Tạo tài khoản ngân hàng thành công'))
})

/**
 * Cập nhật thông tin tài khoản ngân hàng (Admin)
 */
const updateBankAccount = catchAsync(async (req, res) => {
  const { bankAccountId } = req.params
  const updatedBankAccount = await bankAccountService.updateBankAccount(bankAccountId, req.body)
  return res.status(200).json(ApiResponse.success(updatedBankAccount, 'Cập nhật thông tin tài khoản ngân hàng thành công'))
})

/**
 * Lấy thông tin tài khoản ngân hàng theo ID (Admin)
 */
const getBankAccountById = catchAsync(async (req, res) => {
  const { bankAccountId } = req.params
  const bankAccount = await bankAccountService.getBankAccountById(bankAccountId)
  return res.status(200).json(ApiResponse.success(bankAccount, 'Lấy thông tin tài khoản ngân hàng thành công'))
})

/**
 * Xóa tài khoản ngân hàng (Admin)
 */
const deleteBankAccount = catchAsync(async (req, res) => {
  const { bankAccountId } = req.params
  const result = await bankAccountService.deleteBankAccount(bankAccountId)
  return res.status(200).json(ApiResponse.success(result, 'Xóa tài khoản ngân hàng thành công'))
})

/**
 * Xác minh tài khoản ngân hàng (Admin)
 */
const verifyBankAccount = catchAsync(async (req, res) => {
  const { bankAccountId } = req.params
  const { verificationNote } = req.body
  const verifiedBankAccount = await bankAccountService.updateBankAccount(bankAccountId, { 
    isVerified: true,
    verifiedBy: req.user._id,
    verifiedAt: new Date(),
    verificationNote
  })
  return res.status(200).json(ApiResponse.success(verifiedBankAccount, 'Xác minh tài khoản ngân hàng thành công'))
})

/**
 * Từ chối xác minh tài khoản ngân hàng (Admin)
 */
const rejectBankAccount = catchAsync(async (req, res) => {
  const { bankAccountId } = req.params
  const { rejectionReason } = req.body
  const rejectedBankAccount = await bankAccountService.updateBankAccount(bankAccountId, { 
    isVerified: false,
    rejectedBy: req.user._id,
    rejectedAt: new Date(),
    rejectionReason
  })
  return res.status(200).json(ApiResponse.success(rejectedBankAccount, 'Từ chối xác minh tài khoản ngân hàng thành công'))
})

/**
 * Kích hoạt/Vô hiệu hóa tài khoản ngân hàng (Admin)
 */
const toggleBankAccountStatus = catchAsync(async (req, res) => {
  const { bankAccountId } = req.params
  const { isActive } = req.body
  const updatedBankAccount = await bankAccountService.updateBankAccount(bankAccountId, { isActive })
  return res.status(200).json(ApiResponse.success(updatedBankAccount, 'Cập nhật trạng thái tài khoản ngân hàng thành công'))
})

/**
 * Lấy danh sách tài khoản ngân hàng theo người dùng (Admin)
 */
const getBankAccountsByUser = catchAsync(async (req, res) => {
  const { userId } = req.params
  const { page = 1, limit = 10 } = req.query
  
  const bankAccounts = await bankAccountService.getAllBankAccounts({ userId }, parseInt(page), parseInt(limit))
  return res.status(200).json(ApiResponse.success(bankAccounts, 'Lấy danh sách tài khoản ngân hàng theo người dùng thành công'))
})

/**
 * Lấy thống kê tài khoản ngân hàng (Admin)
 */
const getBankAccountStats = catchAsync(async (req, res) => {
  const stats = await bankAccountService.getBankAccountStats()
  return res.status(200).json(ApiResponse.success(stats, 'Lấy thống kê tài khoản ngân hàng thành công'))
})

/**
 * Lấy danh sách các ngân hàng phổ biến (Admin)
 */
const getPopularBanks = catchAsync(async (req, res) => {
  const popularBanks = await bankAccountService.getPopularBanks()
  return res.status(200).json(ApiResponse.success(popularBanks, 'Lấy danh sách ngân hàng phổ biến thành công'))
})

export const adminBankAccountController = {
  getBankAccounts,
  createBankAccount,
  updateBankAccount,
  getBankAccountById,
  deleteBankAccount,
  verifyBankAccount,
  rejectBankAccount,
  toggleBankAccountStatus,
  getBankAccountsByUser,
  getBankAccountStats,
  getPopularBanks
} 