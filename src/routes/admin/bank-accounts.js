import express from 'express'
import { adminBankAccountController } from '~/controllers/admin/adminBankAccountController'
import { adminAuth } from '~/middlewares/adminMiddleware'
import { bankAccountValidation } from '~/validations/bankAccountvalidation'

const Router = express.Router()

// Get bank account statistics (must be before /:bankAccountId routes)
Router.get('/stats', adminAuth, adminBankAccountController.getBankAccountStats)

// Get popular banks
Router.get('/popular-banks', adminAuth, adminBankAccountController.getPopularBanks)

// Get all bank accounts (Admin only)
Router.route('/')
  .get(adminAuth, adminBankAccountController.getBankAccounts)
  .post(adminAuth, bankAccountValidation.createBankAccount, adminBankAccountController.createBankAccount)

// Bank account management by ID
Router.route('/:bankAccountId')
  .get(adminAuth, adminBankAccountController.getBankAccountById)
  .patch(adminAuth, bankAccountValidation.updatebankAccount, adminBankAccountController.updateBankAccount)
  .delete(adminAuth, adminBankAccountController.deleteBankAccount)

// Bank account action routes
Router.patch('/:bankAccountId/verify', adminAuth, adminBankAccountController.verifyBankAccount)
Router.patch('/:bankAccountId/reject', adminAuth, adminBankAccountController.rejectBankAccount)
Router.patch('/:bankAccountId/toggle-status', adminAuth, adminBankAccountController.toggleBankAccountStatus)

// Get bank accounts by user
Router.get('/user/:userId', adminAuth, adminBankAccountController.getBankAccountsByUser)

export const adminBankAccountRoutes = Router 