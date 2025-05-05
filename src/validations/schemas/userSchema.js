import Joi from 'joi'
import { VALIDATION_RULES } from '~/constants'

/**
 * Schema validation thông tin đăng ký người dùng
 */
export const registerSchema = Joi.object({
  email: Joi.string().required().email().lowercase().trim().messages({
    'string.email': 'Email không hợp lệ',
    'string.empty': 'Email không được để trống',
    'any.required': 'Email là trường bắt buộc'
  }),

  password: Joi.string().required().min(6).messages({
    'string.empty': 'Mật khẩu không được để trống',
    'string.min': 'Mật khẩu phải có ít nhất 6 ký tự',
    'any.required': 'Mật khẩu là trường bắt buộc'
  }),

  fullName: Joi.string()
    .required()
    .min(VALIDATION_RULES.FULLNAME_MIN_LENGTH)
    .max(VALIDATION_RULES.FULLNAME_MAX_LENGTH)
    .trim()
    .messages({
      'string.empty': 'Họ tên không được để trống',
      'string.min': `Họ tên phải có ít nhất ${VALIDATION_RULES.FULLNAME_MIN_LENGTH} ký tự`,
      'string.max': `Họ tên không được vượt quá ${VALIDATION_RULES.FULLNAME_MAX_LENGTH} ký tự`,
      'any.required': 'Họ tên là trường bắt buộc'
    }),

  phone: Joi.string().required().pattern(VALIDATION_RULES.PHONE_NUMBER_RULE).messages({
    'string.empty': 'Số điện thoại không được để trống',
    'string.pattern.base': 'Số điện thoại không hợp lệ',
    'any.required': 'Số điện thoại là trường bắt buộc'
  })
})

/**
 * Schema validation thông tin đăng nhập
 */
export const loginSchema = Joi.object({
  email: Joi.string().email().lowercase().trim().messages({
    'string.email': 'Email không hợp lệ'
  }),

  phone: Joi.string().pattern(VALIDATION_RULES.PHONE_NUMBER_RULE).messages({
    'string.pattern.base': 'Số điện thoại không hợp lệ'
  }),

  password: Joi.string().required().messages({
    'string.empty': 'Mật khẩu không được để trống',
    'any.required': 'Mật khẩu là trường bắt buộc'
  })
})
  .or('email', 'phone')
  .messages({
    'object.missing': 'Vui lòng cung cấp email hoặc số điện thoại'
  })

/**
 * Schema validation cập nhật thông tin người dùng
 */
export const updateUserSchema = Joi.object({
  fullName: Joi.string()
    .min(VALIDATION_RULES.FULLNAME_MIN_LENGTH)
    .max(VALIDATION_RULES.FULLNAME_MAX_LENGTH)
    .trim()
    .messages({
      'string.min': `Họ tên phải có ít nhất ${VALIDATION_RULES.FULLNAME_MIN_LENGTH} ký tự`,
      'string.max': `Họ tên không được vượt quá ${VALIDATION_RULES.FULLNAME_MAX_LENGTH} ký tự`
    })
})
  .min(1)
  .messages({
    'object.min': 'Phải có ít nhất một trường cần cập nhật'
  })
