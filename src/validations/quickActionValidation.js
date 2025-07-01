import { quicActionUpdateSchema, quickActionSchema } from './schemas/quickActionSchema'
import { validateRequest } from './validateRequest'

/**
 * Middleware to validate quick action data.
 */
const quickActionRequest = validateRequest(quickActionSchema)

const quickActionUpdate = validateRequest(quicActionUpdateSchema)

export const quickActionValidation = { quickActionRequest, quickActionUpdate }
