import { StatusCodes } from 'http-status-codes'
import mongoose from 'mongoose'
import logger from '~/utils/logger'

// Middleware xử lý lỗi tập trung trong ứng dụng Back-end NodeJS (ExpressJS)
export const errorHandlingMiddleware = (err, req, res, _next) => {
  // Nếu không cẩn thận thiếu statusCode thì mặc định sẽ để code 500 INTERNAL_SERVER_ERROR
  if (!err.statusCode) err.statusCode = StatusCodes.INTERNAL_SERVER_ERROR

  // Xử lý các loại lỗi cụ thể
  if (err instanceof mongoose.Error.ValidationError) {
    err.statusCode = StatusCodes.BAD_REQUEST
    const validationErrors = {}
    for (const field in err.errors) {
      validationErrors[field] = err.errors[field].message
    }
    err.validationErrors = validationErrors
  }

  if (err instanceof mongoose.Error.CastError) {
    err.statusCode = StatusCodes.BAD_REQUEST
    err.message = `Invalid ${err.path}: ${err.value}`
  }

  if (err.code === 11000) {
    err.statusCode = StatusCodes.CONFLICT
    const field = Object.keys(err.keyPattern)[0]
    err.message = `Duplicate field value: ${field}. Please use another value!`
  }

  if (err.name === 'JsonWebTokenError') {
    err.statusCode = StatusCodes.UNAUTHORIZED
    err.message = 'Invalid token. Please log in again!'
  }

  if (err.name === 'TokenExpiredError') {
    err.statusCode = StatusCodes.UNAUTHORIZED
    err.message = 'Your token has expired! Please log in again.'
  }

  // Tạo ra một biến responseError để kiểm soát những gì muốn trả về
  const responseError = {
    statusCode: err.statusCode,
    message: err.message || StatusCodes[err.statusCode] // Nếu lỗi mà không có message thì lấy ReasonPhrases chuẩn theo mã Status Code
  }

  // Nếu có lỗi validation, thêm vào response
  if (err.validationErrors) {
    responseError.validationErrors = err.validationErrors
  }

  const logInfo = {
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
    userId: req.user?._id
  }

  // Log lỗi với mức độ phù hợp dựa trên status code
  if (responseError.statusCode >= 500) {
    logger.error(`Server Error: ${responseError.message}`, {
      ...logInfo,
      error: {
        ...responseError,
        stack: err.stack // Chỉ log stack trace, không trả về trong response
      }
    })
  } else if (responseError.statusCode >= 400) {
    logger.warn(`Client Error: ${responseError.message}`, {
      ...logInfo,
      error: {
        statusCode: responseError.statusCode,
        message: responseError.message,
        validationErrors: responseError.validationErrors
      }
    })
  }

  // Trả responseError về phía Front-end (không bao gồm stack trace)
  res.status(responseError.statusCode).json(responseError)
}
