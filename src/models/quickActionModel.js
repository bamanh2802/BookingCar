import mongoose, { Schema, Types } from 'mongoose'
import { DOCUMENT_NAMES, QUICK_ACTION_TITLES, VALIDATION_RULES } from '~/constants'

const quickActionSchema = new Schema(
  {
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
      match: [VALIDATION_RULES.PHONE_NUMBER_RULE, 'Invalid phone number format']
    },
    title: {
      type: String,
      enum: [QUICK_ACTION_TITLES.ASSIST_BOOK_TICKET, QUICK_ACTION_TITLES.QUICK_LOAN, QUICK_ACTION_TITLES.REPORT],
      required: true,
      index: true
    },
    userId: {
      type: Types.ObjectId,
      ref: DOCUMENT_NAMES.USER,
      required: false,
      default: null
    },
    isDone: { type: Boolean, default: false }
  },
  {
    timestamps: true
  }
)

export const quickActionModel = mongoose.model(DOCUMENT_NAMES.QUICK_ACTION, quickActionSchema)
