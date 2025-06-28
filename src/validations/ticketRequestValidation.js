import { cancleTicketSchema, ticketRequestSchema, ticketRequestUpdateSchema } from './schemas/ticketRequestSchema'
import { validateRequest } from './validateRequest'

/**
 * Middleware to validate ticket request data.
 */
const createTicketRequest = validateRequest(ticketRequestSchema)

/**
 * Middleware to validate ticket request update data.
 */
const updateTicketRequest = validateRequest(ticketRequestUpdateSchema)

/**
 * Middleware to validate ticket request cancellation data.
 */
const cancelTicketRequest = validateRequest(cancleTicketSchema)

export const ticketRequestValidation = {
  createTicketRequest,
  updateTicketRequest,
  cancelTicketRequest
}
