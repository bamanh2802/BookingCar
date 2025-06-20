import mongoose, { Schema } from 'mongoose'
import { DOCUMENT_NAMES, VALIDATION_RULES } from '~/constants'

const bankAccountSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: DOCUMENT_NAMES.USER, required: true, unique: true },
    bankName: { type: String, required: true },
    accountNumber: {
      type: String,
      required: true,
      trim: true,
      match: [VALIDATION_RULES.BANK_ACCOUNT_NUMBER_RULE, 'Số tài khoản phải là chuỗi số từ 8 đến 20 chữ số']
    },
    accountHolderName: { type: String, required: true },
    isVerified: { type: Boolean, default: false },
    verificationNote: { type: String, default: '' }
  },
  { timestamps: true }
)

export const bankAccountModel = mongoose.model(DOCUMENT_NAMES.BANK_ACCOUNT, bankAccountSchema)
