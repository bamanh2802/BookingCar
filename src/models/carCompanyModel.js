import mongoose, { Schema } from 'mongoose'
import { CAR_TYPES, DOCUMENT_NAMES, VALIDATION_RULES } from '~/constants'

const seatSchema = new Schema(
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
  },
  { _id: false } // Optional: không cần _id riêng cho mỗi seat nếu không dùng đến
)

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
      default: function () {
        return this.seatMap.length
      }
    },
    seatMap: {
      type: [seatSchema],
      default: []
    }
  },
  {
    timestamps: true
  }
)

// Middleware: Tính toán tổng số ghế trước khi lưu vào database
// Middleware này sẽ tự động chạy trước khi validate (trước khi lưu vào database)
carCompanySchema.pre('validate', function (next) {
  if (Array.isArray(this.seatMap)) {
    this.totalSeats = this.seatMap.length
  }
  next()
})

export const carCompanyModel = mongoose.model(DOCUMENT_NAMES.CAR_COMPANY, carCompanySchema)
