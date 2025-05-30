import express from 'express'
import { PERMISSIONS, USER_ROLES } from '~/constants'
import { tripController } from '~/controllers/tripController'
import { authMiddleware } from '~/middlewares/authMiddleware'
import { tripValidation } from '~/validations/tripValidation'

const Router = express.Router()

Router.route('/')
  .get(authMiddleware.authenticate, authMiddleware.restrictTo(USER_ROLES.ADMIN), tripController.getTrips)
  .post(
    authMiddleware.authenticate,
    authMiddleware.hasPermission(PERMISSIONS.MANAGE_ROUTES),
    tripValidation.createTrip,
    tripController.createTrip
  )

Router.route('/:tripId')
  .get(authMiddleware.authenticate, tripController.getTripById)
  .patch(
    authMiddleware.authenticate,
    authMiddleware.hasPermission(PERMISSIONS.MANAGE_ROUTES),
    tripValidation.updateTrip,
    tripController.updateTrip
  )
  .delete(
    authMiddleware.authenticate,
    authMiddleware.hasPermission(PERMISSIONS.MANAGE_ROUTES),
    tripController.deleteTrip
  )

export const tripRoutes = Router
