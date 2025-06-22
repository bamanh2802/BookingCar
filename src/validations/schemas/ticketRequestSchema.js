import Joi from 'joi'
import { CAR_TYPES, TICKET_STATUS, TITLE_TICKET_REQUESTS, VALIDATION_RULES } from '~/constants'

/**
 * Schema validation for ticket request
 */

export const ticketRequestSchema = Joi.object({
  userId: Joi.string().required().messages({
    'string.empty': 'User ID is required',
    'any.required': 'User ID is required'
  }),

  titleRequest: Joi.string()
    .valid(TITLE_TICKET_REQUESTS.BOOK_TICKET, TITLE_TICKET_REQUESTS.CANCEL_TICKET, TITLE_TICKET_REQUESTS.REFUND)
    .required()
    .messages({
      'any.only': 'titleRequest không hợp lệ',
      'any.required': 'titleRequest là trường bắt buộc'
    }),

  tripId: Joi.when('titleRequest', {
    is: Joi.valid(TITLE_TICKET_REQUESTS.REFUND),
    then: Joi.string().optional(),
    otherwise: Joi.string().required().messages({
      'string.empty': 'Trip ID is required',
      'any.required': 'Trip ID is required'
    })
  }),

  price: Joi.when('titleRequest', {
    is: Joi.valid(TITLE_TICKET_REQUESTS.REFUND),
    then: Joi.number().optional(),
    otherwise: Joi.number().required().min(0).messages({
      'number.base': 'Giá vé không hợp lệ',
      'number.min': 'Giá vé phải lớn hơn hoặc bằng 0',
      'any.required': 'Giá vé là trường bắt buộc'
    })
  }),

  seats: Joi.when('titleRequest', {
    is: Joi.valid(TITLE_TICKET_REQUESTS.REFUND),
    then: Joi.array().optional(),
    otherwise: Joi.array()
      .items(
        Joi.object({
          code: Joi.string().required().max(3).messages({
            'string.empty': 'Seat code is required',
            'string.max': 'Seat code cannot exceed 3 characters'
          }),
          floor: Joi.number().required().messages({
            'number.base': 'Floor must be a number',
            'any.required': 'Floor is required'
          })
        })
      )
      .default([])
      .messages({
        'array.base': 'Seats must be an array'
      })
  }),

  passengerName: Joi.when('titleRequest', {
    is: Joi.valid(TITLE_TICKET_REQUESTS.REFUND),
    then: Joi.string().optional(),
    otherwise: Joi.string()
      .required()
      .min(VALIDATION_RULES.FULLNAME_MIN_LENGTH)
      .max(VALIDATION_RULES.FULLNAME_MAX_LENGTH)
      .trim()
      .messages({
        'string.empty': 'Họ tên không được để trống',
        'string.min': `Họ tên phải có ít nhất ${VALIDATION_RULES.FULLNAME_MIN_LENGTH} ký tự`,
        'string.max': `Họ tên không được vượt quá ${VALIDATION_RULES.FULLNAME_MAX_LENGTH} ký tự`,
        'any.required': 'Họ tên là trường bắt buộc'
      })
  }),

  passengerPhone: Joi.when('titleRequest', {
    is: Joi.valid(TITLE_TICKET_REQUESTS.REFUND),
    then: Joi.string().optional(),
    otherwise: Joi.string().required().pattern(VALIDATION_RULES.PHONE_NUMBER_RULE).messages({
      'string.empty': 'Số điện thoại không được để trống',
      'string.pattern.base': 'Số điện thoại không hợp lệ',
      'any.required': 'Số điện thoại là trường bắt buộc'
    })
  }),

  type: Joi.when('titleRequest', {
    is: Joi.valid(TITLE_TICKET_REQUESTS.REFUND),
    then: Joi.string().optional(),
    otherwise: Joi.string().valid(CAR_TYPES.REGULAR, CAR_TYPES.VIP).required().messages({
      'any.only': 'Type must be either REGULAR or VIP',
      'any.required': 'Type is required'
    })
  }),

  amount: Joi.when('titleRequest', {
    is: Joi.valid(TITLE_TICKET_REQUESTS.REFUND),
    then: Joi.number().required().min(0).messages({
      'number.base': 'Số tiền hoàn không hợp lệ',
      'number.min': 'Số tiền hoàn phải >= 0',
      'any.required': 'Số tiền hoàn là trường bắt buộc'
    }),
    otherwise: Joi.number().optional()
  }),

  reason: Joi.string().optional(),

  status: Joi.string()
    .valid(
      TICKET_STATUS.PENDING,
      TICKET_STATUS.CONFIRMED,
      TICKET_STATUS.CANCELLED,
      TICKET_STATUS.REFUNDED,
      TICKET_STATUS.REJECTED
    )
    .default(TICKET_STATUS.PENDING)
    .messages({
      'any.only': 'Status không hợp lệ'
    })
})

export const ticketRequestUpdateSchema = Joi.object({
  status: Joi.string()
    .valid(
      TICKET_STATUS.PENDING,
      TICKET_STATUS.CONFIRMED,
      TICKET_STATUS.CANCELLED,
      TICKET_STATUS.REFUNDED,
      TICKET_STATUS.REJECTED
    )
    .messages({
      'any.only': 'Status không hợp lệ'
    }),
  titleRequest: Joi.string()
    .valid(TITLE_TICKET_REQUESTS.BOOK_TICKET, TITLE_TICKET_REQUESTS.CANCEL_TICKET, TITLE_TICKET_REQUESTS.REFUND)
    .messages({
      'any.only': 'titleRequest không hợp lệ'
    }),
  seats: Joi.array()
    .items(
      Joi.object({
        code: Joi.string().max(3).messages({
          'string.max': 'Seat code cannot exceed 3 characters'
        }),
        floor: Joi.number().messages({
          'number.base': 'Floor must be a number'
        })
      })
    )
    .messages({
      'array.base': 'Seats must be an array'
    }),
  passengerName: Joi.string(),
  passengerPhone: Joi.string(),
  type: Joi.string().valid(CAR_TYPES.REGULAR, CAR_TYPES.VIP),
  amount: Joi.number().min(0),
  reason: Joi.string().optional()
})
