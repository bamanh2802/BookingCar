import { StatusCodes } from 'http-status-codes'

/**
 * Lớp lỗi API cơ bản
 */
export class ApiError extends Error {
  constructor(statusCode, message) {
    super(message)
    this.name = 'ApiError'
    this.statusCode = statusCode
    Error.captureStackTrace(this, this.constructor)
  }
}

/**
 * Lỗi không tìm thấy tài nguyên (404)
 */
export class NotFoundError extends ApiError {
  constructor(message = 'Resource not found') {
    super(StatusCodes.NOT_FOUND, message)
    this.name = 'NotFoundError'
  }
}

/**
 * Lỗi xác thực (401)
 */
export class AuthenticationError extends ApiError {
  constructor(message = 'Authentication failed') {
    super(StatusCodes.UNAUTHORIZED, message)
    this.name = 'AuthenticationError'
  }
}

/**
 * Lỗi phân quyền (403)
 */
export class ForbiddenError extends ApiError {
  constructor(message = 'Access forbidden') {
    super(StatusCodes.FORBIDDEN, message)
    this.name = 'ForbiddenError'
  }
}

/**
 * Lỗi dữ liệu không hợp lệ (400)
 */
export class BadRequestError extends ApiError {
  constructor(message = 'Bad request', validationErrors = null) {
    super(StatusCodes.BAD_REQUEST, message)
    this.name = 'BadRequestError'
    this.validationErrors = validationErrors
  }
}

/**
 * Lỗi xung đột dữ liệu (409)
 */
export class ConflictError extends ApiError {
  constructor(message = 'Conflict error', field = null) {
    super(StatusCodes.CONFLICT, message)
    this.name = 'ConflictError'
    this.field = field
  }
}
