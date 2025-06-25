import express from 'express'
import { adminCompanyController } from '~/controllers/admin/adminCompanyController'
import { adminAuth } from '~/middlewares/adminMiddleware'
import { carCompanyValidation } from '~/validations/carCompanyValidation'

const Router = express.Router()

// Get all companies (Admin only)
Router.route('/')
  .get(adminAuth, adminCompanyController.getCompanies)
  .post(adminAuth, carCompanyValidation.createCarCompany, adminCompanyController.createCompany)

// Company management by ID
Router.route('/:companyId')
  .get(adminAuth, adminCompanyController.getCompanyById)
  .patch(adminAuth, carCompanyValidation.updateCarCompany, adminCompanyController.updateCompany)
  .delete(adminAuth, adminCompanyController.deleteCompany)

// Toggle company status
Router.patch('/:companyId/toggle-status', adminAuth, adminCompanyController.toggleCompanyStatus)

export const adminCompanyRoutes = Router 