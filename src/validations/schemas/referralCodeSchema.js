import Joi from 'joi'
import { VALIDATION_RULES } from '~/constants'

export const generateReferralCodeSchema = Joi.object({
  userId: Joi.string().optional(),
  code: Joi.string().trim().min(6).max(10).optional().messages({
    'string.min': 'Referral code must be at least 6 characters long',
    'string.max': 'Referral code cannot exceed 10 characters'
  })
})

export const useReferralCodeSchema = Joi.object({
  code: Joi.string()
    .required()
    .trim()
    .min(6)
    .max(10)
    .messages({
      'string.empty': 'Referral code is required',
      'string.min': 'Referral code must be at least 6 characters long',
      'string.max': 'Referral code cannot exceed 10 characters',
      'any.required': 'Referral code is required'
    })
})

export const deactivateReferralCodeSchema = Joi.object({
  code: Joi.string()
    .required()
    .trim()
    .messages({
      'string.empty': 'Referral code is required',
      'any.required': 'Referral code is required'
    })
}) 