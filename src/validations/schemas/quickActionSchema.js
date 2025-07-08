import Joi from 'joi'
import { QUICK_ACTION_TITLES, VALIDATION_RULES } from '~/constants'

export const quickActionSchema = Joi.object({
  phone: Joi.string().required().pattern(VALIDATION_RULES.PHONE_NUMBER_RULE).messages({
    'string.empty': 'Số điện thoại không được để trống',
    'string.pattern.base': 'Số điện thoại không hợp lệ',
    'any.required': 'Số điện thoại là trường bắt buộc'
  }),
  title: Joi.string()
    .valid(QUICK_ACTION_TITLES.ASSIST_BOOK_TICKET, QUICK_ACTION_TITLES.QUICK_LOAN)
    .required()
    .messages({
      'any.only': 'title không hợp lệ',
      'any.required': 'title là trường bắt buộc'
    }),
  userId: Joi.string().optional()
})

export const quicActionUpdateSchema = Joi.object({
  isDone: Joi.boolean().required().messages({
    'any.only': 'isDone không hợp lệ',
    'any.required': 'isDone là trường bắt buộc'
  })
})
