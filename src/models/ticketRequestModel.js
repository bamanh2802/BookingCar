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
      required: function () {
        return this.titleRequest !== TITLE_TICKET_REQUESTS.REFUND
      }
    },
    titleRequest: {
      type: String,
      enum: [TITLE_TICKET_REQUESTS.BOOK_TICKET, TITLE_TICKET_REQUESTS.CANCEL_TICKET, TITLE_TICKET_REQUESTS.REFUND],
      required: true
    },
    price: {
      type: Number,
      required: function () {
        return this.titleRequest !== TITLE_TICKET_REQUESTS.REFUND
      },
      min: [0, 'Price cannot be negative']
    },
    passengerName: {
      type: String,
      required: function () {
        return this.titleRequest !== TITLE_TICKET_REQUESTS.REFUND
      },
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
      required: function () {
        return this.titleRequest !== TITLE_TICKET_REQUESTS.REFUND
      },
      trim: true,
      match: [VALIDATION_RULES.PHONE_NUMBER_RULE, 'Invalid phone number format']
    },
    seats: {
      _id: false,
      type: [
        {
          code: {
            type: String,
            required: function () {
              return this.titleRequest !== TITLE_TICKET_REQUESTS.REFUND
            },
            trim: true,
            maxLength: [3, 'Seat code cannot exceed 3 characters']
          },
          floor: {
            type: Number,
            required: function () {
              return this.titleRequest !== TITLE_TICKET_REQUESTS.REFUND
            }
          }
        }
      ],
      default: []
    },
    type: {
      type: String,
      enum: [CAR_TYPES.REGULAR, CAR_TYPES.VIP],
      required: function () {
        return this.titleRequest !== TITLE_TICKET_REQUESTS.REFUND
      }
    },
    amount: {
      type: Number,
      required: function () {
        return this.titleRequest === TITLE_TICKET_REQUESTS.REFUND
      },
      min: [0, 'Amount cannot be negative']
    },
    reason: {
      type: String
    },
    status: {
      type: String,
      enum: [
        TICKET_STATUS.PENDING,
        TICKET_STATUS.CONFIRMED,
        TICKET_STATUS.CANCELLED,
        TICKET_STATUS.REFUNDED,
        TICKET_STATUS.REJECTED
      ],
      default: TICKET_STATUS.PENDING
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
