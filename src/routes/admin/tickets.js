import express from 'express'
import { adminTicketController } from '~/controllers/admin/adminTicketController'
import { adminAuth } from '~/middlewares/adminMiddleware'
import { ticketValidation } from '~/validations/ticketValidation'

const Router = express.Router()

// Get all tickets (Admin only)
Router.route('/')
  .get(adminAuth, adminTicketController.getTickets)
  .post(adminAuth, ticketValidation.createTicket, adminTicketController.createTicket)

// Ticket management by ID
Router.route('/:ticketId')
  .get(adminAuth, adminTicketController.getTicketById)
  .patch(adminAuth, ticketValidation.updateTicket, adminTicketController.updateTicket)
  .delete(adminAuth, adminTicketController.deleteTicket)

// Ticket action routes
Router.patch('/:ticketId/confirm', adminAuth, adminTicketController.confirmTicket)
Router.patch('/:ticketId/cancel', adminAuth, adminTicketController.cancelTicket)
Router.patch('/:ticketId/refund', adminAuth, adminTicketController.refundTicket)

// Get tickets by trip
Router.get('/trip/:tripId', adminAuth, adminTicketController.getTicketsByTrip)

// Get tickets by user
Router.get('/user/:userId', adminAuth, adminTicketController.getTicketsByUser)

export const adminTicketRoutes = Router 