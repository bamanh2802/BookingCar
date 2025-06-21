import mongoose, { Schema } from 'mongoose'
import { DOCUMENT_NAMES, REFUND_STATUS } from '~/constants'

const commissionPaidHistorySchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: DOCUMENT_NAMES.USER, required: true },
    roleId: { type: Schema.Types.ObjectId, ref: DOCUMENT_NAMES.USER_ROLE, required: true },
    amount: { type: Number, required: true },
    ticketId: { type: Schema.Types.ObjectId, ref: DOCUMENT_NAMES.TICKET, required: true },
    status: {
      type: String,
      enum: [REFUND_STATUS.COMPLETED, REFUND_STATUS.FAILED],
      required: true
    },
    reason: { type: String, required: true }
  },
  { timestamps: true }
)

export const commissionPaidHistoryModel = mongoose.model(
  DOCUMENT_NAMES.COMMISSION_PAID_HISTORY,
  commissionPaidHistorySchema
)
