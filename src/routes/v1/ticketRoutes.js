import express from 'express'
const Router = express.Router()
import { PERMISSIONS, USER_ROLES } from '~/constants'
import { authMiddleware } from '~/middlewares/authMiddleware'

Router.route('/').get(
  authMiddleware.authenticate,
  authMiddleware.hasPermission(PERMISSIONS.VIEW_TICKETS)
  //   ticketController.getTickets
)

export const ticketRoutes = Router
