import { validateRequest } from './validateRequest'
import { tripSchema, tripUpdateSchema } from './schemas/tripSchema'

/**
 * Middleware to validate tao moi trip
 */
const createTrip = validateRequest(tripSchema)
/**
 * Middleware to validate cap nhat trip
 */
const updateTrip = validateRequest(tripUpdateSchema)

export const tripValidation = {
  createTrip,
  updateTrip
}
