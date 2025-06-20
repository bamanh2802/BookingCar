import { StatusCodes } from 'http-status-codes'
import { bankAccountService } from '~/services/bankAccountService'
import ApiResponse from '~/utils/ApiResponse'
import { catchAsync } from '~/utils/catchAsync'

const createBankAccount = catchAsync(async (req, res) => {
  const bankAccount = await bankAccountService.createBankAccount(req.body)
  res
    .status(StatusCodes.CREATED)
    .json(ApiResponse.success(bankAccount, 'Thêm tài khoản thành công. Vui lòng chờ xác minh !'))
})

const getAllBankAccounts = catchAsync(async (req, res) => {
  const { userId, bankName, isVerified } = req.query
  const page = parseInt(req.query.page) || 1
  const limit = parseInt(req.query.limit) || 10
  const sortBy = req.query.sortBy || 'createdAt'

  const filter = {}

  // Chỉ thêm vào filter nếu có query
  if (userId) {
    filter.userId = userId
  }

  if (bankName) {
    filter.bankName = bankName
  }

  if (isVerified !== undefined) {
    filter.isVerified = isVerified === 'true'
  }

  // Nếu filter rỗng (không có trường nào), giữ nguyên {}
  const finalFilter = Object.keys(filter).length > 0 ? filter : {}

  const bankAccounts = await bankAccountService.getAllBankAccounts(finalFilter, page, limit)
  res.status(StatusCodes.OK).json(ApiResponse.success(bankAccounts, 'Lấy danh sách tài khoản ngân hàng thành công'))
})

const updateBankAccount = catchAsync(async (req, res) => {
  const { accountId } = req.params
  const updatedAccount = await bankAccountService.updateBankAccount(accountId, req.body)
  res.status(StatusCodes.OK).json(ApiResponse.success(updatedAccount, 'Cập nhật tài khoản ngân hàng thành công'))
})

const deleteBankAccount = catchAsync(async (req, res) => {
  const { accountId } = req.params
  await bankAccountService.deleteBankAccount(accountId)
  res.status(StatusCodes.OK).json(ApiResponse.success(null, 'Xóa tài khoản ngân hàng thành công'))
})

export const bankAccountController = {
  createBankAccount,
  getAllBankAccounts,
  updateBankAccount,
  deleteBankAccount
}
