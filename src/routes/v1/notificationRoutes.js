import express from 'express'
import { notificationController } from '~/controllers/notificationController'
import { authMiddleware } from '~/middlewares/authMiddleware'

const Router = express.Router()

Router.route('/')
  .get(authMiddleware.authenticate, notificationController.getUserNotifications)
  .patch(authMiddleware.authenticate, notificationController.markAllNotificationsAsRead)

Router.route('/notificationId').patch(authMiddleware.authenticate, notificationController.markNotificationAsRead)
export const notificationRoutes = Router
