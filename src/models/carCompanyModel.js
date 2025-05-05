import mongoose, { Schema } from 'mongoose'
import { CAR_TYPES, DOCUMENT_NAMES, VALIDATION_RULES } from '~/constants'

const seatSchema = new Schema({
  code: String,
  floor: Number
})
const carCompanySchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxLength: [
        VALIDATION_RULES.FULLNAME_MAX_LENGTH,
        `Full name cannot exceed ${VALIDATION_RULES.FULLNAME_MAX_LENGTH} characters`
      ],
      minLength: [
        VALIDATION_RULES.FULLNAME_MIN_LENGTH,
        `Fullname must be at least ${VALIDATION_RULES.FULLNAME_MIN_LENGTH} characters long`
      ]
    },
    description: {
      type: String,
      maxLength: [500, 'Description cannot exceed 500 characters']
    },
    hotline: {
      type: String,
      required: [true, 'Hotline is required'],
      trim: true,
      match: [VALIDATION_RULES.PHONE_NUMBER_RULE, 'Invalid phone number format']
    },
    type: {
      type: String,
      enum: [CAR_TYPES.VIP, CAR_TYPES.REGULAR],
      required: true
    },
    totalSeats: {
      type: Number,
      required: true
    },
    seatMap: [seatSchema]
  },
  {
    timestamps: true
  }
)

export const carCompanyModel = mongoose.model(DOCUMENT_NAMES.CAR_COMPANY, carCompanySchema)
