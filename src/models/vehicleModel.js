import mongoose, { Schema } from 'mongoose'
import { DOCUMENT_NAMES, VALIDATION_RULES } from '~/constants'

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
  { _id: false }
)

const vehicleSchema = new Schema(
  {
    // === THÔNG TIN ĐỊNH DANH ===
    companyId: {
      type: Schema.Types.ObjectId,
      ref: DOCUMENT_NAMES.CAR_COMPANY,
      required: true,
      index: true
    },
    licensePlate: {
      type: String,
      required: [true, 'License plate is required'],
      unique: true,
      trim: true,
      uppercase: true
    },

    // === THÔNG TIN KỸ THUẬT ===
    specifications: {
      type: {
        type: String,
        enum: ['bus', 'coach', 'limousine', 'sleeper', 'minivan'],
        required: true,
        index: true
      },
      brand: {
        type: String,
        trim: true
      }
    },

    // === TÌNH TRẠNG VÀ HOẠT ĐỘNG ===
    status: {
      type: String,
      enum: ['active', 'maintenance', 'inactive', 'retired'],
      default: 'active',
      index: true
    },

    // === SƠ ĐỒ GHẾ ===
    seatMap: {
      type: [seatSchema],
      default: []
    },
    totalSeats: {
      type: Number,
      default: function () {
        return this.seatMap.length
      },
      min: [0, 'Total seats cannot be negative'],
      index: true
    }
  },
  {
    timestamps: true
  }
)

// Enhanced compound indexes for optimal aggregation performance
vehicleSchema.index({ companyId: 1, status: 1 })
vehicleSchema.index({ status: 1, 'specifications.type': 1 })
vehicleSchema.index({ companyId: 1, 'specifications.type': 1 })
vehicleSchema.index({ status: 1, totalSeats: 1 })
vehicleSchema.index({ createdAt: 1 })
vehicleSchema.index({ companyId: 1, licensePlate: 1 })

// Middleware: Tính toán tổng số ghế trước khi lưu
vehicleSchema.pre('validate', function (next) {
  if (Array.isArray(this.seatMap)) {
    this.totalSeats = this.seatMap.length
  }
  next()
})

export const vehicleModel = mongoose.model(DOCUMENT_NAMES.VEHICLE, vehicleSchema) 