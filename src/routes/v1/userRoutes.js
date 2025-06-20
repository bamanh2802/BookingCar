import express from 'express'
import { PERMISSIONS, USER_ROLES } from '~/constants'
import { bankAccountController } from '~/controllers/bankAccountController'
import { userController } from '~/controllers/userController'
import { authMiddleware } from '~/middlewares/authMiddleware'
import ApiResponse from '~/utils/ApiResponse'
import { bankAccountValidation } from '~/validations/bankAccountvalidation'
import { userValidation } from '~/validations/userValidation'

const Router = express.Router()

// Route public - GET
Router.route('/').get((req, res) => {
  res.status(200).json(ApiResponse.success({ message: 'User API' }))
})

// Route đăng ký và đăng nhập - không cần xác thực
Router.route('/register').post(userValidation.register, userController.register)
Router.route('/login').post(userValidation.login, userController.login)
Router.route('/refresh-token').post(userController.refreshToken)

// Các routes yêu cầu xác thực
Router.route('/profile')
  .get(authMiddleware.authenticate, userController.getProfile)
  .patch(authMiddleware.authenticate, userValidation.updateProfile, userController.updateProfile)

//Route liên quan đến tài khoản ngân hàng
Router.route('/bank-account')
  // Lấy toàn bộ tài khoản ngân hàng của người dùng (admin only)
  .get(
    authMiddleware.authenticate,
    authMiddleware.restrictTo(USER_ROLES.ADMIN),
    bankAccountController.getAllBankAccounts
  )
  .post(
    authMiddleware.authenticate,
    authMiddleware.hasPermission(PERMISSIONS.CREATE_BANK_ACCOUNT),
    bankAccountValidation.createBankAccount,
    bankAccountController.createBankAccount
  )

// Route cập nhật và xóa tài khoản ngân hàng
Router.route('/bank-account/:accountId')
  .patch(
    authMiddleware.authenticate,
    authMiddleware.hasPermission(PERMISSIONS.UPDATE_BANK_ACCOUNT),
    bankAccountValidation.updatebankAccount,
    bankAccountController.updateBankAccount
  )
  .delete(
    authMiddleware.authenticate,
    authMiddleware.hasPermission(PERMISSIONS.DELETE_BANK_ACCOUNT),
    bankAccountController.deleteBankAccount
  )

Router.route('/bank-account/:userId').get(
  authMiddleware.authenticate,
  authMiddleware.hasPermission(PERMISSIONS.VIEW_BANK_ACCOUNT),
  authMiddleware.isSelf,
  bankAccountController.getBankAccountByUserId
)

Router.route('/bank-account/verify/:accountId').patch(
  authMiddleware.authenticate,
  authMiddleware.hasPermission(PERMISSIONS.VERIFY_BANK_ACCOUNT),
  bankAccountValidation.verifyBankAccount,
  bankAccountController.verifyBankAccount
)

export const userRoutes = Router
