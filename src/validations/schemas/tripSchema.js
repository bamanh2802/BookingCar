import Joi from 'joi'
import { CAR_TYPES } from '~/constants'

/**
 * Schema validation thông tin chuyến đi
 */
export const tripSchema = Joi.object({
  startLocation: Joi.string().required().messages({
    'string.empty': 'Điểm đi không được để trống',
    'any.required': 'Điểm đi là trường bắt buộc'
  }),

  endLocation: Joi.string().required().messages({
    'string.empty': 'Điểm đến không được để trống',
    'any.required': 'Điểm đến là trường bắt buộc'
  }),

  startStation: Joi.string().required().messages({
    'string.empty': 'Điểm bến xe đi  không được để trống',
    'any.required': 'Điểm bến xe đi là trường bắt buộc'
  }),

  endStation: Joi.string().required().messages({
    'string.empty': 'Điểm bến xe đến không được để trống',
    'any.required': 'Điểm bến xe đến là trường bắt buộc'
  }),

  startTime: Joi.date().required().messages({
    'date.base': 'Thời gian khởi hành không hợp lệ',
    'any.required': 'Thời gian khởi hành là trường bắt buộc'
  }),

  endTime: Joi.date().greater(Joi.ref('startTime')).required().messages({
    'date.base': 'Thời gian kết thúc không hợp lệ',
    'date.greater': 'Thời gian kết thúc phải lớn hơn thời gian khởi hành',
    'any.required': 'Thời gian kết thúc là trường bắt buộc'
  }),

  price: Joi.number().required().min(0).messages({
    'number.base': 'Giá vé không hợp lệ',
    'number.min': 'Giá vé phải lớn hơn hoặc bằng 0',
    'any.required': 'Giá vé là trường bắt buộc'
  }),

  carCompanyId: Joi.string().required().messages({
    'string.empty': 'ID công ty xe không được để trống',
    'any.required': 'ID công ty xe là trường bắt buộc'
  })
})

/**
 * Schema validation thông tin cập nhật chuyến đi
 */

export const tripUpdateSchema = Joi.object({
  startLocation: Joi.string().min(2).max(100).messages({
    'string.max': 'Điểm đến không được vượt quá 100 ký tự',
    'string.min': 'Điểm đến ty phải có ít nhất 2 ký tự'
  }),

  endLocation: Joi.string().min(2).max(100).messages({
    'string.max': 'Điểm đến không được vượt quá 100 ký tự',
    'string.min': 'Điểm đến ty phải có ít nhất 2 ký tự'
  }),

  startStation: Joi.string().messages({
    'string.empty': 'Điểm bến xe đi  không được để trống',
    'any.required': 'Điểm bến xe đi là trường bắt buộc'
  }),

  endStation: Joi.string().messages({
    'string.empty': 'Điểm bến xe đến không được để trống',
    'any.required': 'Điểm bến xe đến là trường bắt buộc'
  }),

  startTime: Joi.date().greater('now').messages({
    'date.base': 'Thời gian khởi hành không hợp lệ',
    'date.greater': 'Thời gian khởi hành phải sau thời điểm hiện tại'
  }),
  endTime: Joi.date().greater(Joi.ref('startTime')).messages({
    'date.base': 'Thời gian kết thúc không hợp lệ',
    'date.greater': 'Thời gian kết thúc phải lớn hơn thời gian khởi hành'
  }),

  price: Joi.number().min(0).messages({
    'number.base': 'Giá vé không hợp lệ',
    'number.min': 'Giá vé phải lớn hơn hoặc bằng 0'
  }),

  carCompanyId: Joi.string().messages({
    'string.base': 'ID công ty xe không hợp lệ'
  }),
  type: Joi.string().valid(CAR_TYPES.VIP, CAR_TYPES.REGULAR).messages({
    'string.empty': 'Loại xe không được để trống',
    'any.only': 'Loại xe không hợp lệ'
  })
})
  .or(
    'startLocation',
    'endLocation',
    'startStation',
    'endStation',
    'startTime',
    'endTime',
    'price',
    'carCompanyId',
    'type'
  )
  .messages({
    'object.missing': 'Ít nhất một trường phải được cung cấp để cập nhật'
  })
