import express from 'express'
import { USER_ROLES } from '~/constants'
import { carCompanyController } from '~/controllers/carCompanyController'
import { authMiddleware } from '~/middlewares/authMiddleware'
import { carCompanyValidation } from '~/validations/carCompanyValidation'

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

export const carCompanyRoutes = Router
