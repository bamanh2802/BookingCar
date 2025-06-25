import express from 'express'
import { adminTripController } from '~/controllers/admin/adminTripController'
import { adminAuth } from '~/middlewares/adminMiddleware'
import { tripValidation } from '~/validations/tripValidation'

const Router = express.Router()

// Get all trips (Admin only)
Router.route('/')
  .get(adminAuth, adminTripController.getTrips)
  .post(adminAuth, tripValidation.createTrip, adminTripController.createTrip)

// Trip management by ID
Router.route('/:tripId')
  .get(adminAuth, adminTripController.getTripById)
  .patch(adminAuth, tripValidation.updateTrip, adminTripController.updateTrip)
  .delete(adminAuth, adminTripController.deleteTrip)

// Trip action routes
Router.patch('/:tripId/cancel', adminAuth, adminTripController.cancelTrip)
Router.patch('/:tripId/complete', adminAuth, adminTripController.completeTrip)

// Get trips by company
Router.get('/company/:companyId', adminAuth, adminTripController.getTripsByCompany)

// Get trips by vehicle
Router.get('/vehicle/:vehicleId', adminAuth, adminTripController.getTripsByVehicle)

export const adminTripRoutes = Router 