import Joi from 'joi'

const seatSchema = Joi.object({
  code: Joi.string().max(3).required().messages({
    'string.empty': 'Seat code is required',
    'string.max': 'Seat code cannot exceed 3 characters'
  }),
  floor: Joi.number().integer().min(1).required().messages({
    'number.base': 'Floor must be a number',
    'number.integer': 'Floor must be an integer',
    'number.min': 'Floor must be at least 1'
  })
})

const createVehicle = async (req, res, next) => {
  const correctCondition = Joi.object({
    companyId: Joi.string().hex().length(24).required().messages({
      'string.empty': 'Company ID is required',
      'string.hex': 'Company ID must be a valid hex string',
      'string.length': 'Company ID must be 24 characters long'
    }),
    licensePlate: Joi.string().min(5).max(15).required().messages({
      'string.empty': 'License plate is required',
      'string.min': 'License plate must be at least 5 characters',
      'string.max': 'License plate cannot exceed 15 characters'
    }),
    specifications: Joi.object({
      type: Joi.string().valid('bus', 'coach', 'limousine', 'sleeper', 'minivan').required().messages({
        'any.only': 'Type must be one of: bus, coach, limousine, sleeper, minivan',
        'string.empty': 'Vehicle type is required'
      }),
      brand: Joi.string().min(2).max(50).optional().messages({
        'string.min': 'Brand must be at least 2 characters',
        'string.max': 'Brand cannot exceed 50 characters'
      })
    }).required(),
    status: Joi.string().valid('active', 'maintenance', 'inactive', 'retired').optional().default('active'),
    seatMap: Joi.array().items(seatSchema).optional().messages({
      'array.base': 'Seat map must be an array'
    })
  })

  try {
    await correctCondition.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error) {
    const customError = new Error(error.message)
    customError.statusCode = 422
    next(customError)
  }
}

const updateVehicle = async (req, res, next) => {
  const correctCondition = Joi.object({
    licensePlate: Joi.string().min(5).max(15).optional().messages({
      'string.min': 'License plate must be at least 5 characters',
      'string.max': 'License plate cannot exceed 15 characters'
    }),
    specifications: Joi.object({
      type: Joi.string().valid('bus', 'coach', 'limousine', 'sleeper', 'minivan').optional().messages({
        'any.only': 'Type must be one of: bus, coach, limousine, sleeper, minivan'
      }),
      brand: Joi.string().min(2).max(50).optional().messages({
        'string.min': 'Brand must be at least 2 characters',
        'string.max': 'Brand cannot exceed 50 characters'
      })
    }).optional(),
    status: Joi.string().valid('active', 'maintenance', 'inactive', 'retired').optional(),
    seatMap: Joi.array().items(seatSchema).optional().messages({
      'array.base': 'Seat map must be an array'
    })
  })

  try {
    await correctCondition.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error) {
    const customError = new Error(error.message)
    customError.statusCode = 422
    next(customError)
  }
}

const validateObjectId = async (req, res, next) => {
  const correctCondition = Joi.object({
    id: Joi.string().hex().length(24).required().messages({
      'string.empty': 'Vehicle ID is required',
      'string.hex': 'Vehicle ID must be a valid hex string',
      'string.length': 'Vehicle ID must be 24 characters long'
    })
  })

  try {
    await correctCondition.validateAsync(req.params, { abortEarly: false })
    next()
  } catch (error) {
    const customError = new Error(error.message)
    customError.statusCode = 422
    next(customError)
  }
}

const validateCompanyId = async (req, res, next) => {
  const correctCondition = Joi.object({
    companyId: Joi.string().hex().length(24).required().messages({
      'string.empty': 'Company ID is required',
      'string.hex': 'Company ID must be a valid hex string',
      'string.length': 'Company ID must be 24 characters long'
    })
  })

  try {
    await correctCondition.validateAsync(req.params, { abortEarly: false })
    next()
  } catch (error) {
    const customError = new Error(error.message)
    customError.statusCode = 422
    next(customError)
  }
}

const validateQuery = async (req, res, next) => {
  const correctCondition = Joi.object({
    page: Joi.number().integer().min(1).optional().default(1),
    limit: Joi.number().integer().min(1).max(100).optional().default(10),
    companyId: Joi.string().hex().length(24).optional(),
    status: Joi.string().valid('active', 'maintenance', 'inactive', 'retired').optional(),
    type: Joi.string().valid('bus', 'coach', 'limousine', 'sleeper', 'minivan').optional(),
    brand: Joi.string().optional()
  })

  try {
    const { error, value } = await correctCondition.validateAsync(req.query, { abortEarly: false })
    if (error) throw error
    req.query = value
    next()
  } catch (error) {
    const customError = new Error(error.message)
    customError.statusCode = 422
    next(customError)
  }
}

export const vehicleValidation = {
  createVehicle,
  updateVehicle,
  validateObjectId,
  validateCompanyId,
  validateQuery
} 