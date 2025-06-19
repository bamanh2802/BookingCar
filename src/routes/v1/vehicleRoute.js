import express from 'express'
import { PERMISSIONS } from '~/constants'
import { vehicleController } from '~/controllers/vehicleController'
import { vehicleValidation } from '~/validations/vehicleValidation'
import { authMiddleware } from '~/middlewares/authMiddleware'

const Router = express.Router()

// GET /vehicles/statistics - Thống kê vehicles  
Router.route('/statistics').get(
  authMiddleware.authenticate,
  authMiddleware.hasPermission(PERMISSIONS.VIEW_VEHICLES),
  vehicleController.getVehicleStatistics
)

// GET /vehicles/available - Lấy vehicles available
Router.route('/available').get(
  authMiddleware.authenticate,
  authMiddleware.hasPermission(PERMISSIONS.VIEW_VEHICLES),
  vehicleController.getAvailableVehicles
)

// GET /vehicles - Lấy danh sách vehicles
// POST /vehicles - Tạo vehicle mới (chỉ Admin)
Router.route('/')
  .get(
    authMiddleware.authenticate,
    authMiddleware.hasPermission(PERMISSIONS.VIEW_VEHICLES),
    vehicleValidation.validateQuery,
    vehicleController.getVehicles
  )
  .post(
    authMiddleware.authenticate,
    authMiddleware.hasPermission(PERMISSIONS.CREATE_VEHICLE),
    vehicleValidation.createVehicle,
    vehicleController.createVehicle
  )

// GET /vehicles/:id - Lấy vehicle theo ID
// PATCH /vehicles/:id - Cập nhật vehicle (chỉ Admin)  
// DELETE /vehicles/:id - Xóa vehicle (chỉ Admin)
Router.route('/:id')
  .get(
    authMiddleware.authenticate,
    authMiddleware.hasPermission(PERMISSIONS.VIEW_DETAIL_VEHICLE),
    vehicleValidation.validateObjectId,
    vehicleController.getVehicleById
  )
  .patch(
    authMiddleware.authenticate,
    authMiddleware.hasPermission(PERMISSIONS.UPDATE_VEHICLE),
    vehicleValidation.validateObjectId,
    vehicleValidation.updateVehicle,
    vehicleController.updateVehicle
  )
  .delete(
    authMiddleware.authenticate,
    authMiddleware.hasPermission(PERMISSIONS.DELETE_VEHICLE),
    vehicleValidation.validateObjectId,
    vehicleController.deleteVehicle
  )

export const vehicleRoute = Router 