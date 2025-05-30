import mongoose from 'mongoose'
import { Schema } from 'mongoose'
import { DOCUMENT_NAMES } from '~/constants'
import { ConflictError } from '~/utils/errors'

const tripSchema = new Schema(
  {
    startLocation: {
      type: String,
      required: true,
      trim: true
    },
    endLocation: {
      type: String,
      required: true,
      trim: true
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
      required: true
    },
    endTime: {
      type: Date,
      required: true
    },
    carCompanyId: {
      type: Schema.Types.ObjectId,
      ref: DOCUMENT_NAMES.CAR_COMPANY,
      required: true
    },
    seatMapId: {
      type: Schema.Types.ObjectId,
      ref: DOCUMENT_NAMES.SEAT_MAP,
      required: true
    },
    price: {
      type: Number,
      required: true,
      min: [0, 'Price cannot be negative']
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
    }
  },
  {
    timestamps: true
  }
)

tripSchema.methods.updateAvailableSeats = function (seatsBooked) {
  if (this.availableSeats - seatsBooked < 0) {
    throw new ConflictError(`Not enough available seats. Only ${this.availableSeats} seats left.`)
  }
  this.availableSeats -= seatsBooked
  return this.save()
}

export const tripModel = mongoose.model(DOCUMENT_NAMES.TRIP, tripSchema)
