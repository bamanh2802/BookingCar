import { ticketSchema, ticketUpdateSchema } from './schemas/ticketSchema'
import { validateRequest } from './validateRequest'

/**
 * Middleware to validate ticket data.
 */

const createTicket = validateRequest(ticketSchema)

/**
 * Middleware to validate ticket update data.
 */
const updateTicket = validateRequest(ticketUpdateSchema)

export const ticketValidation = {
  createTicket,
  updateTicket
}
