import mongoose, { Schema } from 'mongoose'
import { DOCUMENT_NAMES } from '~/constants'

const bankAccountSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: DOCUMENT_NAMES.USER, required: true },
    bankName: { type: String, required: true },
    accountNumber: { type: String, required: true },
    accountHolderName: { type: String, required: true },
    branch: { type: String }
  },
  { timestamps: true }
)

module.exports = mongoose.model(DOCUMENT_NAMES.BANK_ACCOUNT, bankAccountSchema)
