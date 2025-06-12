import express from 'express'
import { PERMISSIONS, USER_ROLES } from '~/constants'
import { ticketRequestController } from '~/controllers/ticketRequestController'
import { authMiddleware } from '~/middlewares/authMiddleware'
import { ticketRequestValidation } from '~/validations/ticketRequestValidation'

const Router = express.Router()

Router.route('/')
  .get(
    authMiddleware.authenticate,
    authMiddleware.hasPermission(PERMISSIONS.MANAGE_TICKET_REQUESTS),
    ticketRequestController.getTicketRequests
  )
  .post(
    authMiddleware.authenticate,
    authMiddleware.restrictTo(USER_ROLES.ADMIN, USER_ROLES.AGENT_LV1, USER_ROLES.AGENT_LV2, USER_ROLES.CLIENT),
    ticketRequestValidation.createTicketRequest,
    ticketRequestController.createTicketRequest
  )

Router.route('/:ticketRequestId')
  .get(
    authMiddleware.authenticate,
    authMiddleware.hasPermission(PERMISSIONS.VIEW_TICKET_REQUESTS),
    authMiddleware.checkViewTicketRequestById,
    ticketRequestController.getTicketRequestById
  )
  .patch(
    authMiddleware.authenticate,
    authMiddleware.hasPermission(PERMISSIONS.MANAGE_TICKET_REQUESTS),
    ticketRequestValidation.updateTicketRequest,
    ticketRequestController.updateTicketRequest
  )
  .delete(
    authMiddleware.authenticate,
    authMiddleware.hasPermission(PERMISSIONS.MANAGE_TICKET_REQUESTS),
    ticketRequestController.deleteTicketRequest
  )

Router.route('/user/:userId').get(
  authMiddleware.authenticate,
  authMiddleware.hasPermission(PERMISSIONS.VIEW_TICKET_REQUESTS),
  authMiddleware.checkViewTicketByUserId,
  ticketRequestController.getTicketRequestsByUserId
)

Router.route('/trip/:tripId').get(
  authMiddleware.authenticate,
  authMiddleware.hasPermission(PERMISSIONS.MANAGE_TICKET_REQUESTS),
  authMiddleware.checkViewTripByUserRole,
  ticketRequestController.getTicketRequestsByTripId
)
export const ticketRequestRoutes = Router
