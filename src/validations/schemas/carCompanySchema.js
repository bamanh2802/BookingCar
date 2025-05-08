import Joi from 'joi'
import { CAR_TYPES, VALIDATION_RULES } from '~/constants'
/**
 * Schema validation thông tin công ty
 */

export const carCompanySchema = Joi.object({
  name: Joi.string()
    .required()
    .max(100)
    .min(VALIDATION_RULES.FULLNAME_MIN_LENGTH)
    .max(VALIDATION_RULES.FULLNAME_MAX_LENGTH)
    .trim()
    .messages({
      'string.empty': 'Tên công ty không được để trống',
      'string.max': 'Tên công ty không được vượt quá 100 ký tự',
      'string.min': 'Tên công ty phải có ít nhất 2 ký tự',
      'any.required': 'Tên công ty là trường bắt buộc'
    }),

  description: Joi.string().max(500).messages({
    'string.max': 'Mô tả không được vượt quá 500 ký tự'
  }),

  hotline: Joi.string().required().pattern(VALIDATION_RULES.PHONE_NUMBER_RULE).trim().messages({
    'string.empty': 'Số điện thoại không được để trống',
    'string.pattern.base': 'Số điện thoại không hợp lệ',
    'any.required': 'Số điện thoại là trường bắt buộc'
  }),

  type: Joi.string().valid(CAR_TYPES.REGULAR, CAR_TYPES.VIP).required().messages({
    'any.only': 'Loại xe không hợp lệ',
    'any.required': 'Loại xe là trường bắt buộc'
  }),

  seatMap: Joi.array().items(
    Joi.object({
      code: Joi.string().required(),
      floor: Joi.number().required()
    })
  )
})

export const carCompanyUpdateSchema = Joi.object({
  name: Joi.string()
    .max(100)
    .min(VALIDATION_RULES.FULLNAME_MIN_LENGTH)
    .max(VALIDATION_RULES.FULLNAME_MAX_LENGTH)
    .trim()
    .messages({
      'string.empty': 'Tên công ty không được để trống',
      'string.max': 'Tên công ty không được vượt quá 100 ký tự',
      'string.min': 'Tên công ty phải có ít nhất 2 ký tự'
    }),

  description: Joi.string().max(500).messages({
    'string.max': 'Mô tả không được vượt quá 500 ký tự'
  }),

  hotline: Joi.string().pattern(VALIDATION_RULES.PHONE_NUMBER_RULE).trim().messages({
    'string.empty': 'Số điện thoại không được để trống',
    'string.pattern.base': 'Số điện thoại không hợp lệ'
  }),

  type: Joi.string().valid(CAR_TYPES.REGULAR, CAR_TYPES.VIP).messages({
    'any.only': 'Loại xe không hợp lệ'
  }),

  seatMap: Joi.array().items(
    Joi.object({
      code: Joi.string().required(),
      floor: Joi.number().required()
    })
  )
})
  .or('name', 'description', 'hotline', 'type', 'totalSeats', 'seatMap')
  .messages({
    'object.missing': 'Cần ít nhất một trường để cập nhật'
  })
