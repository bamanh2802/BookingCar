import { StatusCodes } from 'http-status-codes'
import Joi from 'joi'
import ApiError from '~/utils/ApiError'
import {
  EMAIL_RULE,
  EMAIL_RULE_MESSAGE,
  PASSWORD_RULE,
  PASSWORD_RULE_MESSAGE,
  PHONE_NUMBER_RULE
} from '~/utils/validators'

const register = async (req, res, next) => {
  const correctCondition = Joi.object({
    email: Joi.string().required().pattern(EMAIL_RULE).message(EMAIL_RULE_MESSAGE),
    password: Joi.string().required().min(8).pattern(PASSWORD_RULE).message(PASSWORD_RULE_MESSAGE),
    fullName: Joi.string().required().min(2),
    phone: Joi.string().required().pattern(PHONE_NUMBER_RULE).message('Phone number invalid')
  })
  try {
    await correctCondition.validateAsync(req.body, { abortEarly: false })

    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message))
  }
}

const login = async (req, res, next) => {
  const correctCondition = Joi.object({
    email: Joi.string().pattern(EMAIL_RULE).message(EMAIL_RULE_MESSAGE),
    phone: Joi.string().pattern(PHONE_NUMBER_RULE).message('Phone number invalid'),
    password: Joi.string().required().min(8).pattern(PASSWORD_RULE).message(PASSWORD_RULE_MESSAGE)
  }).or('email', 'phone')

  try {
    await correctCondition.validateAsync(req.body, { abortEarly: false, allowUnknown: true })
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message))
  }
}

export const userValidation = { register, login }
