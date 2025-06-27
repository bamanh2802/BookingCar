import express from 'express'
import { PERMISSIONS } from '~/constants'
import { tripController } from '~/controllers/tripController'
import { authMiddleware } from '~/middlewares/authMiddleware'
import { tripValidation } from '~/validations/tripValidation'

const Router = express.Router()

Router.route('/')
  .get(tripController.getTrips)
  .post(
    authMiddleware.authenticate,
    authMiddleware.hasPermission(PERMISSIONS.CREATE_TRIP),
    tripValidation.createTrip,
    tripController.createTrip
  )

Router.route('/:tripId')
  .get(
    authMiddleware.authenticate,
    authMiddleware.hasPermission(PERMISSIONS.VIEW_DETAIL_TRIP),
    tripController.getTripById
  )
  .patch(
    authMiddleware.authenticate,
    authMiddleware.hasPermission(PERMISSIONS.UPDATE_TRIP),
    tripValidation.updateTrip,
    tripController.updateTrip
  )
  .delete(authMiddleware.authenticate, authMiddleware.hasPermission(PERMISSIONS.DELETE_TRIP), tripController.deleteTrip)

export const tripRoutes = Router
