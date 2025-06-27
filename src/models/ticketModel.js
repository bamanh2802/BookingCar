import mongoose, { Schema } from 'mongoose'
import { CAR_TYPES, DOCUMENT_NAMES, TICKET_STATUS, VALIDATION_RULES } from '~/constants'

const ticketSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: DOCUMENT_NAMES.USER,
      required: true,
      index: true
    },
    tripId: {
      type: Schema.Types.ObjectId,
      ref: DOCUMENT_NAMES.TRIP,
      required: true,
      index: true
    },
    requestId: {
      type: Schema.Types.ObjectId,
      ref: DOCUMENT_NAMES.TICKET_REQUEST,
      required: true
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price must be a positive number'],
      index: true
    },
    status: {
      type: String,
      enum: [TICKET_STATUS.PENDING, TICKET_STATUS.CONFIRMED, TICKET_STATUS.CANCELLED, TICKET_STATUS.REFUNDED],
      default: TICKET_STATUS.PENDING,
      index: true
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
      required: true,
      index: true
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: DOCUMENT_NAMES.USER,
      default: null
    },
    commissionPaid: {
      type: Boolean,
      default: false,
      index: true
    },
    pickupStation: {
      type: String,
      trim: true,
      default: null
    },
    dropoffStation: {
      type: String,
      trim: true,
      default: null
    }
  },
  { timestamps: true }
)

ticketSchema.index({ status: 1, createdAt: 1 })
ticketSchema.index({ status: 1, price: 1 })
ticketSchema.index({ status: 1, type: 1 })
ticketSchema.index({ tripId: 1, status: 1 })
ticketSchema.index({ commissionPaid: 1, status: 1 })
ticketSchema.index({ createdAt: 1 })
ticketSchema.index({ type: 1, price: 1 })

export const ticketModel = mongoose.model(DOCUMENT_NAMES.TICKET, ticketSchema)
