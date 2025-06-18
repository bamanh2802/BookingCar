import mongoose, { Schema } from 'mongoose'
import { CAR_TYPES, DOCUMENT_NAMES, TICKET_STATUS, TITLE_TICKET_REQUESTS, VALIDATION_RULES } from '~/constants'

const ticketRequestSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: DOCUMENT_NAMES.USER,
      required: true
    },
    tripId: {
      type: Schema.Types.ObjectId,
      ref: DOCUMENT_NAMES.TRIP,
      required: true
    },
    titleRequest: {
      type: String,
      enum: [TITLE_TICKET_REQUESTS.BOOK_TICKET, TITLE_TICKET_REQUESTS.CANCEL_TICKET],
      required: true
    },
    status: {
      type: String,
      enum: [TICKET_STATUS.PENDING, TICKET_STATUS.CONFIRMED, TICKET_STATUS.CANCELLED],
      default: TICKET_STATUS.PENDING
    },
    passengerName: {
      type: String,
      required: [true, 'Fullname is required'],
      trim: true,
      maxlength: [
        VALIDATION_RULES.FULLNAME_MAX_LENGTH,
        `Full name cannot exceed ${VALIDATION_RULES.FULLNAME_MAX_LENGTH} characters`
      ],
      minLength: [
        VALIDATION_RULES.FULLNAME_MIN_LENGTH,
        `Fullname must be at least ${VALIDATION_RULES.FULLNAME_MIN_LENGTH} characters long`
      ]
    },
    passengerPhone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
      match: [VALIDATION_RULES.PHONE_NUMBER_RULE, 'Invalid phone number format']
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
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: DOCUMENT_NAMES.USER,
      default: null
    }
  },
  {
    timestamps: true
  }
)

export const ticketRequestModel = mongoose.model(DOCUMENT_NAMES.TICKET_REQUEST, ticketRequestSchema)
