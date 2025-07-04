import mongoose, { Schema } from 'mongoose'
import { DOCUMENT_NAMES, REFUND_STATUS } from '~/constants'

const refundHistorySchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: DOCUMENT_NAMES.USER, required: true },
    amount: { type: Number, required: true },
    bankAccountId: { type: Schema.Types.ObjectId, ref: DOCUMENT_NAMES.BANK_ACCOUNT, required: true },
    status: {
      type: String,
      enum: [REFUND_STATUS.COMPLETED, REFUND_STATUS.FAILED],
      required: true
    },
    reason: { type: String, required: true }
  },
  { timestamps: true }
)

export const refundHistoryModel = mongoose.model(DOCUMENT_NAMES.REFUND_HISTORY, refundHistorySchema)
