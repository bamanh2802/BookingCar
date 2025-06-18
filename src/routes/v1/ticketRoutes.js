import express from 'express'
const Router = express.Router()
import { PERMISSIONS } from '~/constants'
import { ticketController } from '~/controllers/ticketController'
import { authMiddleware } from '~/middlewares/authMiddleware'
import { ticketValidation } from '~/validations/ticketValidation'

/**
 * Lấy danh sách vé (dành cho admin, agent 1, agent 2)
 */
Router.route('/')
  .get(authMiddleware.authenticate, authMiddleware.hasPermission(PERMISSIONS.VIEW_TICKETS), ticketController.getTickets)

  .post(
    authMiddleware.authenticate,
    authMiddleware.hasPermission(PERMISSIONS.CREATE_TICKET),
    ticketValidation.createTicket,
    ticketController.createTicket
  )

/**
 *
 */

Router.route('/:ticketId')
  .get(
    authMiddleware.authenticate,
    authMiddleware.hasPermission(PERMISSIONS.VIEW_DETAIL_TICKET),
    ticketController.getTicketById
  )
  .patch(
    authMiddleware.authenticate,
    authMiddleware.checkUpdateOrCancelTicket,
    ticketValidation.updateTicket,
    ticketController.updateTicket
  )
  .delete(
    authMiddleware.authenticate,
    authMiddleware.hasPermission(PERMISSIONS.DELETE_TICKET),
    ticketController.deleteTicket
  )

/**
 *  Lấy danh sách vé của 1 user
 */
Router.route('/:userId/list').get(
  authMiddleware.authenticate,
  authMiddleware.hasPermission(PERMISSIONS.VIEW_HISTORY),
  authMiddleware.checkViewTicketByUserId,
  ticketController.getTicketsByUserId
)

/**
 *Lấy danh sách vé theo tripId (dành cho admin, agent1 , agent 2)
 */
Router.route('/trip/:tripId').get(
  authMiddleware.authenticate,
  authMiddleware.hasPermission(PERMISSIONS.VIEW_TICKETS),
  ticketController.getTicketsByTripId
)

/**
 * Lấy thông tin vé theo userId và tripId
 */
Router.route('/:userId/:tripId').get(
  authMiddleware.authenticate,
  authMiddleware.hasPermission(PERMISSIONS.VIEW_TICKETS),
  ticketController.getTicketsByUserIdAndTripId
)

export const ticketRoutes = Router
