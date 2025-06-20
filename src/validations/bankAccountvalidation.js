import { bankAccountSchema, bankAccountUpdateSchema, bankAccountVerificationSchema } from './schemas/bankAccountSchema'
import { validateRequest } from './validateRequest'

const createBankAccount = validateRequest(bankAccountSchema)

const updatebankAccount = validateRequest(bankAccountUpdateSchema)

const verifyBankAccount = validateRequest(bankAccountVerificationSchema)

export const bankAccountValidation = {
  createBankAccount,
  updatebankAccount,
  verifyBankAccount
}
