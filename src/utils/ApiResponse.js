import { StatusCodes } from 'http-status-codes'

/**
 * Lớp xử lý response API chuẩn hóa
 */
class ApiResponse {
  constructor(statusCode, data, message = '') {
    this.statusCode = statusCode
    this.success = statusCode < 400
    this.message = message || this._getDefaultMessageForStatusCode(statusCode)
    this.data = data
  }

  /**
   * Lấy message mặc định dựa trên status code
   * @param {Number} statusCode HTTP status code
   * @returns {String} Default message
   */
  _getDefaultMessageForStatusCode(statusCode) {
    switch (statusCode) {
      case StatusCodes.OK:
        return 'Thực hiện thành công'
      case StatusCodes.CREATED:
        return 'Tạo mới thành công'
      case StatusCodes.ACCEPTED:
        return 'Yêu cầu được chấp nhận'
      case StatusCodes.NO_CONTENT:
        return 'Không có dữ liệu'
      case StatusCodes.BAD_REQUEST:
        return 'Yêu cầu không hợp lệ'
      case StatusCodes.UNAUTHORIZED:
        return 'Không có quyền truy cập'
      case StatusCodes.FORBIDDEN:
        return 'Không được phép truy cập'
      case StatusCodes.NOT_FOUND:
        return 'Không tìm thấy tài nguyên'
      case StatusCodes.INTERNAL_SERVER_ERROR:
        return 'Lỗi máy chủ nội bộ'
      default:
        return ''
    }
  }

  /**
   * Tạo response thành công (200 OK)
   * @param {Object} data - Dữ liệu trả về
   * @param {String} message - Thông báo (tùy chọn)
   * @returns {ApiResponse} ApiResponse instance
   */
  static success(data, message = '') {
    return new ApiResponse(StatusCodes.OK, data, message)
  }

  /**
   * Tạo response tạo mới thành công (201 Created)
   * @param {Object} data - Dữ liệu trả về
   * @param {String} message - Thông báo (tùy chọn)
   * @returns {ApiResponse} ApiResponse instance
   */
  static created(data, message = '') {
    return new ApiResponse(StatusCodes.CREATED, data, message)
  }

  /**
   * Tạo response lỗi (400 Bad Request)
   * @param {String} message - Thông báo lỗi
   * @param {Object} data - Dữ liệu lỗi bổ sung (tùy chọn)
   * @returns {ApiResponse} ApiResponse instance
   */
  static badRequest(message, data = null) {
    return new ApiResponse(StatusCodes.BAD_REQUEST, data, message)
  }

  /**
   * Tạo response lỗi xác thực (401 Unauthorized)
   * @param {String} message - Thông báo lỗi
   * @param {Object} data - Dữ liệu lỗi bổ sung (tùy chọn)
   * @returns {ApiResponse} ApiResponse instance
   */
  static unauthorized(message, data = null) {
    return new ApiResponse(StatusCodes.UNAUTHORIZED, data, message)
  }

  /**
   * Tạo response lỗi không tìm thấy (404 Not Found)
   * @param {String} message - Thông báo lỗi
   * @param {Object} data - Dữ liệu lỗi bổ sung (tùy chọn)
   * @returns {ApiResponse} ApiResponse instance
   */
  static notFound(message, data = null) {
    return new ApiResponse(StatusCodes.NOT_FOUND, data, message)
  }

  /**
   * Tạo response lỗi máy chủ (500 Internal Server Error)
   * @param {String} message - Thông báo lỗi
   * @param {Object} data - Dữ liệu lỗi bổ sung (tùy chọn)
   * @returns {ApiResponse} ApiResponse instance
   */
  static serverError(message, data = null) {
    return new ApiResponse(StatusCodes.INTERNAL_SERVER_ERROR, data, message)
  }
}

export default ApiResponse
