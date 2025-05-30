import express from 'express'
import { StatusCodes } from 'http-status-codes'
import userRoleRoutes from './userRoleRoutes'
import { userRoutes } from './userRoutes'
import { carCompanyRoutes } from './companyRoute'
import { tripRoutes } from './tripRoutes'

const Router = express.Router()

Router.use('/test', (req, res) => {
  res.status(StatusCodes.OK).json({ message: 'Hello' })
})

Router.use('/user', userRoutes)
Router.use('/roles', userRoleRoutes)
Router.use('/car-companies', carCompanyRoutes)
Router.use('/trips', tripRoutes)

export const API_V1 = Router
