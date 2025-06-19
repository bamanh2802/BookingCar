import express from 'express'
import { StatusCodes } from 'http-status-codes'
import userRoleRoutes from './userRoleRoutes'
import { userRoutes } from './userRoutes'
import { carCompanyRoutes } from './companyRoutes'
import { vehicleRoute } from './vehicleRoute'
import { tripRoutes } from './tripRoutes'
import { ticketRequestRoutes } from './ticketRequestRoutes'
import { ticketRoutes } from './ticketRoutes'
import { adminRoutes } from '../admin/index.js'

const Router = express.Router()

Router.use('/test', (req, res) => {
  res.status(StatusCodes.OK).json({ message: 'Hello' })
})

// Admin routes
Router.use('/admin', adminRoutes)

// Regular routes
Router.use('/user', userRoutes)
Router.use('/roles', userRoleRoutes)
Router.use('/car-companies', carCompanyRoutes)
Router.use('/vehicles', vehicleRoute)
Router.use('/trips', tripRoutes)
Router.use('/ticket-requests', ticketRequestRoutes)
Router.use('/tickets', ticketRoutes)

export const API_V1 = Router
