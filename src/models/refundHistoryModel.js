import mongoose, { Schema } from 'mongoose'
import { DOCUMENT_NAMES, REFUND_STATUS } from '~/constants'

const refundHistorySchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: DOCUMENT_NAMES.USER, required: true },
    amount: { type: Number, required: true },
    bankAccountId: { type: Schema.Types.ObjectId, ref: DOCUMENT_NAMES.BANK_ACCOUNT, required: true },
    ticketId: { type: Schema.Types.ObjectId, ref: DOCUMENT_NAMES.TICKET },
    tripId: { type: Schema.Types.ObjectId, ref: DOCUMENT_NAMES.TRIP },
    status: {
      type: String,
      enum: [REFUND_STATUS.COMPLETED, REFUND_STATUS.FAILED, REFUND_STATUS.PENDING],
      default: REFUND_STATUS.PENDING
    }
  },
  { timestamps: true }
)

export const refundHistoryModel = mongoose.model(DOCUMENT_NAMES.REFUND_HISTORY, refundHistorySchema)
