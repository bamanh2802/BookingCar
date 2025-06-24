import mongoose from 'mongoose'
import { Schema } from 'mongoose'
import { CAR_TYPES, DOCUMENT_NAMES, TRIP_TITLES } from '~/constants'
import { ConflictError } from '~/utils/errors'

const tripSchema = new Schema(
  {
    startLocation: {
      type: String,
      required: true,
      trim: true,
      index: true
    },
    endLocation: {
      type: String,
      required: true,
      trim: true,
      index: true
    },
    startStation: {
      type: String,
      required: true,
      trim: true
    },
    endStation: {
      type: String,
      required: true,
      trim: true
    },
    startTime: {
      type: Date,
      required: true,
      index: true
    },
    endTime: {
      type: Date,
      required: true
    },
    carCompanyId: {
      type: Schema.Types.ObjectId,
      ref: DOCUMENT_NAMES.CAR_COMPANY,
      required: true,
      index: true
    },
    seatMapId: {
      type: Schema.Types.ObjectId,
      ref: DOCUMENT_NAMES.SEAT_MAP,
      required: true
    },
    price: {
      type: Number,
      required: true,
      min: [0, 'Price cannot be negative'],
      index: true
    },
    type: {
      type: String,
      enum: [CAR_TYPES.VIP, CAR_TYPES.REGULAR],
      required: true,
      index: true
    },
    availableSeats: {
      type: Number,
      required: true,
      min: [0, 'Available seats cannot be negative'],
      default: function () {
        return this.totalSeats
      }
    },
    totalSeats: {
      type: Number,
      required: true,
      min: [0, 'Total seats cannot be negative']
    },
    status: {
      type: String,
      enum: [TRIP_TITLES.NOT_STARTED, TRIP_TITLES.COMPLETED],
      default: TRIP_TITLES.NOT_STARTED,
      index: true
    }
  },
  {
    timestamps: true
  }
)

tripSchema.index({ status: 1, createdAt: 1 })
tripSchema.index({ status: 1, type: 1 })
tripSchema.index({ carCompanyId: 1, status: 1 })
tripSchema.index({ startLocation: 1, endLocation: 1 })
tripSchema.index({ startTime: 1, status: 1 })
tripSchema.index({ type: 1, price: 1 })
tripSchema.index({ createdAt: 1 })

tripSchema.methods.updateAvailableSeats = function (seatsBooked) {
  if (this.availableSeats - seatsBooked < 0) {
    throw new ConflictError(`Not enough available seats. Only ${this.availableSeats} seats left.`)
  }
  this.availableSeats -= seatsBooked
  return this.save()
}

export const tripModel = mongoose.model(DOCUMENT_NAMES.TRIP, tripSchema)
