import Joi from 'joi'
import { CAR_TYPES, TICKET_STATUS, VALIDATION_RULES } from '~/constants'

/**
 * Schema validation for ticket
 */

const ticketSchema = Joi.object({
  userId: Joi.string().required().messages({
    'string.empty': 'User ID is required',
    'any.required': 'User ID is required'
  }),

  tripId: Joi.string().required().messages({
    'string.empty': 'Trip ID is required',
    'any.required': 'Trip ID is required'
  }),

  requestId: Joi.string().required().messages({
    'string.empty': 'Request ID is required',
    'any.required': 'Request ID is required'
  }),

  status: Joi.string()
    .valid(TICKET_STATUS.PENDING, TICKET_STATUS.CONFIRMED)
    .default(TICKET_STATUS.PENDING)
    .messages({
      'any.only': `Status must be  ${TICKET_STATUS.PENDING} or ${TICKET_STATUS.CONFIRMED}`
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

  price: Joi.number().required().min(0).messages({
    'number.base': 'Giá vé không hợp lệ',
    'number.min': 'Giá vé phải lớn hơn hoặc bằng 0',
    'any.required': 'Giá vé là trường bắt buộc'
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

  type: Joi.string()
    .valid(CAR_TYPES.REGULAR, CAR_TYPES.VIP)
    .required()
    .messages({
      'any.only': `Type must be either ${CAR_TYPES.REGULAR} or ${CAR_TYPES.VIP}`,
      'any.required': 'Type is required'
    }),

  pickupStation: Joi.string().optional(),
  dropoffStation: Joi.string().optional()
})

/**
 * Schema validation for ticket update
 */

const ticketUpdateSchema = Joi.object({
  titleRequest: Joi.string().optional(),
  status: Joi.string()
    .valid(TICKET_STATUS.PENDING, TICKET_STATUS.CONFIRMED, TICKET_STATUS.CANCELLED, TICKET_STATUS.REFUNDED)
    .messages({
      'any.only': `Status must be one of ${TICKET_STATUS.PENDING}, ${TICKET_STATUS.PAID}, ${TICKET_STATUS.CANCELLED}, ${TICKET_STATUS.REFUNDED}`
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
    })
    .default([]),

  passengerName: Joi.string(),

  passengerPhone: Joi.string(),
  type: Joi.string()
    .valid(CAR_TYPES.REGULAR, CAR_TYPES.VIP)
    .messages({
      'any.only': `Type must be either ${CAR_TYPES.REGULAR} or ${CAR_TYPES.VIP}`
    }),

  pickupStation: Joi.string().optional(),
  dropoffStation: Joi.string().optional()
})

export { ticketSchema, ticketUpdateSchema }
