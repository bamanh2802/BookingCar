import express from 'express'
import { adminVehicleController } from '~/controllers/admin/adminVehicleController'
import { adminAuth } from '~/middlewares/adminMiddleware'
import { vehicleValidation } from '~/validations/vehicleValidation'

const Router = express.Router()

// Get all vehicles (Admin only)
Router.route('/')
  .get(adminAuth, adminVehicleController.getVehicles)
  .post(adminAuth, vehicleValidation.createVehicle, adminVehicleController.createVehicle)

// Vehicle management by ID
Router.route('/:vehicleId')
  .get(adminAuth, adminVehicleController.getVehicleById)
  .patch(adminAuth, vehicleValidation.updateVehicle, adminVehicleController.updateVehicle)
  .delete(adminAuth, adminVehicleController.deleteVehicle)

// Toggle vehicle status
Router.patch('/:vehicleId/toggle-status', adminAuth, adminVehicleController.toggleVehicleStatus)

// Get vehicles by company
Router.get('/company/:companyId', adminAuth, adminVehicleController.getVehiclesByCompany)

export const adminVehicleRoutes = Router 