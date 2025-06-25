import express from 'express'
import { adminTicketRequestController } from '~/controllers/admin/adminTicketRequestController'
import { adminAuth } from '~/middlewares/adminMiddleware'
import { ticketRequestValidation } from '~/validations/ticketRequestValidation'

const Router = express.Router()

// Get ticket request statistics (must be before /:requestId routes)
Router.get('/stats', adminAuth, adminTicketRequestController.getTicketRequestStats)

// Get all ticket requests (Admin only)
Router.route('/')
  .get(adminAuth, adminTicketRequestController.getTicketRequests)
  .post(adminAuth, ticketRequestValidation.createTicketRequest, adminTicketRequestController.createTicketRequest)

// Ticket request management by ID
Router.route('/:requestId')
  .get(adminAuth, adminTicketRequestController.getTicketRequestById)
  .patch(adminAuth, ticketRequestValidation.updateTicketRequest, adminTicketRequestController.updateTicketRequest)
  .delete(adminAuth, adminTicketRequestController.deleteTicketRequest)

// Ticket request action routes
Router.patch('/:requestId/approve', adminAuth, adminTicketRequestController.approveTicketRequest)
Router.patch('/:requestId/reject', adminAuth, adminTicketRequestController.rejectTicketRequest)
Router.patch('/:requestId/process', adminAuth, adminTicketRequestController.processTicketRequest)
Router.patch('/:requestId/complete', adminAuth, adminTicketRequestController.completeTicketRequest)

// Get ticket requests by user
Router.get('/user/:userId', adminAuth, adminTicketRequestController.getTicketRequestsByUser)

export const adminTicketRequestRoutes = Router 