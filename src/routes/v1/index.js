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
import { commissionRoutes } from './commissionRoutes'

import { referralCodeRoutes } from './referralCodeRoutes'

import { notificationRoutes } from './notificationRoutes'
import { quickActionRoutes } from './quickActionRoutes'


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
Router.use('/commissions', commissionRoutes)
Router.use('/referral-codes', referralCodeRoutes)
Router.use('/notification', notificationRoutes)
Router.use('/quick-action', quickActionRoutes)

export const API_V1 = Router
