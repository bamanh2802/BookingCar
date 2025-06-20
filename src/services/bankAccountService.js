import bankAccountRepository from '~/repositories/bankAccountRepository'

const createBankAccount = async (bankAccount) => {
  // Kiểm tra xem người dùng đã có tai khoản ngân hàng chưa
  const existingAccount = await bankAccountRepository.exists(bankAccount.userId)
  if (existingAccount) {
    throw new Error('Người dùng đã có tài khoản ngân hàng. Vui lòng cập nhật thông tin thay vì tạo mới.')
  }
  // Tạo mới tài khoản ngân hàng
  return await bankAccountRepository.createBankAccount(bankAccount)
}

const getAllBankAccounts = async (filter, page, limit) => {
  // Lấy tất cả tài khoản ngân hàng với phân trang và lọc
  return await bankAccountRepository.getAllBankAccounts(filter, page, limit)
}

const updateBankAccount = async (accountId, updateData) => {
  // Kiểm tra xem tài khoản ngân hàng có tồn tại không
  const existingAccount = await bankAccountRepository.findById(accountId)
  if (!existingAccount) {
    throw new Error('Tài khoản ngân hàng không tồn tại')
  }
  // Cập nhật thông tin tài khoản ngân hàng
  return await bankAccountRepository.updateBankAccount(accountId, updateData)
}

const deleteBankAccount = async (accountId) => {
  // Kiểm tra xem tài khoản ngân hàng có tồn tại không
  const existingAccount = await bankAccountRepository.findById(accountId)
  if (!existingAccount) {
    throw new Error('Tài khoản ngân hàng không tồn tại')
  }
  // Xóa tài khoản ngân hàng
  return await bankAccountRepository.deleteBankAccount(accountId)
}

const getBankAccountByUserId = async (userId) => {
  // Lấy tài khoản ngân hàng theo userId
  const bankAccount = await bankAccountRepository.getBankAccountsByUserId(userId)
  if (!bankAccount) {
    throw new Error('Tài khoản ngân hàng không tồn tại cho người dùng này')
  }
  return bankAccount
}

export const bankAccountService = {
  createBankAccount,
  getAllBankAccounts,
  updateBankAccount,
  deleteBankAccount,
  getBankAccountByUserId
}
