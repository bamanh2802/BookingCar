import mongoose, { Schema } from 'mongoose'
import { DOCUMENT_NAMES } from '~/constants'

const referralCodeSchema = new Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 6,
      maxlength: 10,
      index: true // Use index here
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: DOCUMENT_NAMES.USER,
      required: true,
      index: true // Index for faster lookups by userId
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
)

// Create indexes for faster lookups
referralCodeSchema.index({ userId: 1, isActive: 1 }) // Compound index for active codes by user

export const referralCodeModel = mongoose.model(DOCUMENT_NAMES.REFERRAL_CODE, referralCodeSchema) 