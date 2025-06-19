import express from 'express'
import { USER_ROLES, PERMISSIONS } from '~/constants'
import { carCompanyController } from '~/controllers/carCompanyController'
import { vehicleController } from '~/controllers/vehicleController'
import { authMiddleware } from '~/middlewares/authMiddleware'
import { carCompanyValidation } from '~/validations/carCompanyValidation'
import { vehicleValidation } from '~/validations/vehicleValidation'

const Router = express.Router()

//Route quan ly car company (Admin only)
Router.route('/')
  .get(authMiddleware.authenticate, authMiddleware.restrictTo(USER_ROLES.ADMIN), carCompanyController.getCarCompanies)
  .post(
    authMiddleware.authenticate,
    authMiddleware.restrictTo(USER_ROLES.ADMIN),
    carCompanyValidation.createCarCompany,
    carCompanyController.createCarCompany
  )

//Route quan ly car company theo id (Admin only)
Router.route('/:carCompanyId')
  .get(authMiddleware.authenticate, authMiddleware.restrictTo(USER_ROLES.ADMIN), carCompanyController.getCarCompanyById)
  .patch(
    authMiddleware.authenticate,
    authMiddleware.restrictTo(USER_ROLES.ADMIN),
    carCompanyValidation.updateCarCompany,
    carCompanyController.updateCarCompany
  )
  .delete(
    authMiddleware.authenticate,
    authMiddleware.restrictTo(USER_ROLES.ADMIN),
    carCompanyController.deleteCarCompany
  )

// GET /admin/car-companies/:companyId/vehicles - Lấy vehicles của company
Router.route('/:companyId/vehicles').get(
  authMiddleware.authenticate,
  authMiddleware.hasPermission(PERMISSIONS.VIEW_VEHICLES),
  vehicleValidation.validateCompanyId,
  vehicleController.getVehiclesByCompany
)

export const carCompanyRoutes = Router
