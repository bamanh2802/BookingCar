import mongoose, { Schema } from 'mongoose'
import { CAR_TYPES, DOCUMENT_NAMES, TICKET_STATUS } from '~/constants'

const ticketRequestSchema = new Schema(
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
    status: {
      type: String,
      enum: [TICKET_STATUS.PENDING, TICKET_STATUS.CONFIRMED, TICKET_STATUS.CANCELLED],
      default: TICKET_STATUS.PENDING
    },
    seats: {
      _id: false,
      type: [
        {
          code: {
            type: String,
            required: true,
            trim: true,
            maxLength: [3, 'Seat code cannot exceed 3 characters']
          },
          floor: {
            type: Number,
            required: true
          }
        }
      ],
      default: []
    },
    type: {
      type: String,
      enum: [CAR_TYPES.REGULAR, CAR_TYPES.VIP],
      required: true
    }
  },
  {
    timestamps: true
  }
)

export const ticketRequestModel = mongoose.model(DOCUMENT_NAMES.TICKET_REQUEST, ticketRequestSchema)
