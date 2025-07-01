import express from 'express'
import { quickActionController } from '~/controllers/quickActionController'
import { quickActionValidation } from '~/validations/quickActionValidation'
const Router = express.Router()

Router.route('/').post(quickActionValidation.quickActionRequest, quickActionController.createQuickAction)

export const quickActionRoutes = Router
