import express from 'express'
import { StatusCodes } from 'http-status-codes'
import { userController } from '~/controllers/userController'
import { userValidation } from '~/validations/userValidation'

const Router = express.Router()

Router.route('/').get((req, res) => {
  res.status(StatusCodes.OK).json({ message: 'this is userRoute' })
})

Router.route('/register').post(userValidation.register, userController.register)
Router.route('/login').post(userValidation.login, userController.login)
Router.route('/logout').delete(userController.logout)
Router.route('/refresh-token').get(userController.refreshToken)

export const userRoutes = Router
