import mongoose, { Schema } from 'mongoose'
import { CAR_TYPES, DOCUMENT_NAMES, TICKET_STATUS } from '~/constants'

const ticketSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    tripId: {
      type: Schema.Types.ObjectId,
      ref: 'Trip',
      required: true
    },
    requestId: {
      type: Schema.Types.ObjectId,
      ref: 'TicketRequest',
      required: true
    },
    status: {
      type: String,
      enum: [TICKET_STATUS.PENDING, TICKET_STATUS.CONFIRMED, TICKET_STATUS.CANCELLED, TICKET_STATUS.REFUNDED],
      default: TICKET_STATUS.PENDING
    },
    seats: [
      {
        _id: false,
        code: {
          type: String,
          required: true,
          maxLength: 3
        },
        floor: {
          type: Number,
          required: true
        }
      }
    ],
    type: {
      type: String,
      enum: [CAR_TYPES.REGULAR, CAR_TYPES.VIP],
      required: true
    }
  },
  { timestamps: true }
)

export const ticketModel = mongoose.model(DOCUMENT_NAMES.TICKET, ticketSchema)
