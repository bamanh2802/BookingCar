import { ticketRequestSchema, ticketRequestUpdateSchema } from './schemas/ticketRequestSchema'
import { validateRequest } from './validateRequest'

/**
 * Middleware to validate ticket request data.
 */
const createTicketRequest = validateRequest(ticketRequestSchema)

/**
 * Middleware to validate ticket request update data.
 */
const updateTicketRequest = validateRequest(ticketRequestUpdateSchema)

export const ticketRequestValidation = {
  createTicketRequest,
  updateTicketRequest
}
