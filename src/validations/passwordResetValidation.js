import Joi from 'joi'
import { validateRequest } from './validateRequest'

const forgotPasswordSchema = Joi.object({
  email: Joi.string().email().required()
})

const resetPasswordSchema = Joi.object({
  email: Joi.string().email().required(),
  otp: Joi.string().length(6).required(),
  password: Joi.string().min(6).required()
})

export const passwordResetValidation = {
  forgotPassword: validateRequest(forgotPasswordSchema),
  resetPassword: validateRequest(resetPasswordSchema)
} 