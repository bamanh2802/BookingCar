import mongoose, { Schema } from 'mongoose'
import { DOCUMENT_NAMES } from '~/constants'

const refundHistorySchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: DOCUMENT_NAMES.USER, required: true },
    amount: { type: Number, required: true },
    bankAccountId: { type: Schema.Types.ObjectId, ref: DOCUMENT_NAMES.BANK_ACCOUNT, required: true },
    ticketId: { type: Schema.Types.ObjectId, ref: DOCUMENT_NAMES.TICKET },
    status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' }
  },
  { timestamps: true }
)

export const refundHistoryModel = mongoose.model(DOCUMENT_NAMES.REFUND_HISTORY, refundHistorySchema)
