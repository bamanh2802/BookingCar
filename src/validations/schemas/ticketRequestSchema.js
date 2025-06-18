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

  tripId: Joi.string().required().messages({
    'string.empty': 'Trip ID is required',
    'any.required': 'Trip ID is required'
  }),

  status: Joi.string().valid(TICKET_STATUS.PENDING, TICKET_STATUS.CONFIRMED).default(TICKET_STATUS.PENDING).messages({
    'any.only': 'Status must be one of PENDING, CONFIRMED'
  }),
  titleRequest: Joi.string().valid(TITLE_TICKET_REQUESTS.BOOK_TICKET, TITLE_TICKET_REQUESTS.CANCEL_TICKET).messages({
    'any.only': 'Status must be one of BOOK TICKET, CANCEL TICKET'
  }),
  seats: Joi.array()
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
    }),
  passengerName: Joi.string()
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

  passengerPhone: Joi.string().required().pattern(VALIDATION_RULES.PHONE_NUMBER_RULE).messages({
    'string.empty': 'Số điện thoại không được để trống',
    'string.pattern.base': 'Số điện thoại không hợp lệ',
    'any.required': 'Số điện thoại là trường bắt buộc'
  }),

  type: Joi.string().valid(CAR_TYPES.REGULAR, CAR_TYPES.VIP).required().messages({
    'any.only': 'Type must be either REGULAR or VIP',
    'any.required': 'Type is required'
  })
})

export const ticketRequestUpdateSchema = Joi.object({
  status: Joi.string().valid(TICKET_STATUS.PENDING, TICKET_STATUS.CONFIRMED, TICKET_STATUS.CANCELLED).messages({
    'any.only': 'Status must be one of PENDING, CONFIRMED, CANCELLED'
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

  type: Joi.string().valid(CAR_TYPES.REGULAR, CAR_TYPES.VIP).messages({
    'any.only': 'Type must be either REGULAR or VIP'
  })
})
