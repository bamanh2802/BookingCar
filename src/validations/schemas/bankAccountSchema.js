import Joi from 'joi'
import { VALIDATION_RULES } from '~/constants'

export const bankAccountSchema = Joi.object({
  userId: Joi.string().required().messages({
    'string.base': 'ID người dùng phải là một chuỗi',
    'any.required': 'ID người dùng là bắt buộc'
  }),
  bankName: Joi.string().required().messages({
    'string.base': 'Tên ngân hàng phải là một chuỗi',
    'any.required': 'Tên ngân hàng là bắt buộc'
  }),
  accountNumber: Joi.string().required().messages({
    'string.base': 'Số tài khoản phải là một chuỗi',
    'any.required': 'Số tài khoản là bắt buộc'
  }),
  accountHolderName: Joi.string()
    .required()
    .min(VALIDATION_RULES.FULLNAME_MIN_LENGTH)
    .max(VALIDATION_RULES.FULLNAME_MAX_LENGTH)
    .messages({
      'string.base': 'Tên chủ tài khoản phải là một chuỗi',
      'any.required': 'Tên chủ tài khoản là bắt buộc'
    })
})

export const bankAccountUpdateSchema = Joi.object({
  bankName: Joi.string().required().messages({
    'string.base': 'Tên ngân hàng phải là một chuỗi',
    'any.required': 'Tên ngân hàng là bắt buộc'
  }),
  accountNumber: Joi.string().required().pattern(VALIDATION_RULES.BANK_ACCOUNT_NUMBER_RULE).messages({
    'string.pattern.base': 'Số tài khoản không hợp lệ. Vui lòng nhập đúng định dạng.',
    'string.empty': 'Số tài khoản không được để trống',
    'string.base': 'Số tài khoản phải là một chuỗi',
    'any.required': 'Số tài khoản là bắt buộc'
  }),
  accountHolderName: Joi.string()
    .required()
    .min(VALIDATION_RULES.FULLNAME_MIN_LENGTH)
    .max(VALIDATION_RULES.FULLNAME_MAX_LENGTH)
    .messages({
      'string.base': 'Tên chủ tài khoản phải là một chuỗi',
      'any.required': 'Tên chủ tài khoản là bắt buộc'
    })
})

export const bankAccountVerificationSchema = Joi.object({
  isVerified: Joi.boolean().required().messages({
    'boolean.base': 'Trạng thái xác minh phải là một giá trị boolean',
    'any.required': 'Trạng thái xác minh là bắt buộc'
  }),
  verificationNote: Joi.string().optional().allow('').messages({
    'string.base': 'Ghi chú xác minh phải là một chuỗi'
  })
})
