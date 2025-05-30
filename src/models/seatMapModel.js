import mongoose from 'mongoose'
import { Schema } from 'mongoose'
import { DOCUMENT_NAMES } from '~/constants'

const seatMapSchema = new Schema(
  {
    seats: {
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
    totalBookedSeats: {
      type: Number,
      default: function () {
        return this.seats.length
      },
      min: [0, 'Total seats cannot be negative']
    },

    tripId: {
      type: Schema.Types.ObjectId,
      ref: DOCUMENT_NAMES.TRIP,
      default: null
    },
    carCompanyId: {
      type: Schema.Types.ObjectId,
      ref: DOCUMENT_NAMES.CAR_COMPANY,
      required: true
    }
  },
  {
    timestamps: true
  }
)

export const seatMapModel = mongoose.model(DOCUMENT_NAMES.SEAT_MAP, seatMapSchema)
