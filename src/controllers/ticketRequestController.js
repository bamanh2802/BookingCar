import { ticketRequestService } from '~/services/ticketRequestService'

const { StatusCodes } = require('http-status-codes')
const { default: ApiResponse } = require('~/utils/ApiResponse')
const { catchAsync } = require('~/utils/catchAsync')

/**
 * tạo yêu cầu vé mới
 */
const createTicketRequest = catchAsync(async (req, res) => {
  const currentUser = req.user
  const ticketRequest = await ticketRequestService.createTicketRequest(req.body, currentUser)
  return res.status(StatusCodes.CREATED).json(ApiResponse.created(ticketRequest, 'Tạo yêu cầu vé thành công'))
})

/**
 * Lấy danh sách yêu cầu vé
 */
const getTicketRequests = catchAsync(async (req, res) => {
  const { page, limit } = req.query
  const filter = req.query.filter || {}
  const ticketRequests = await ticketRequestService.getTicketRequests(filter, page, limit)
  return res.status(StatusCodes.OK).json(ApiResponse.success(ticketRequests, 'Lấy danh sách yêu cầu vé thành công'))
})

/**
 * Lấy danh sách yêu cầu vé theo ID người dùng
 */
const getTicketRequestsByUserId = catchAsync(async (req, res) => {
  const { userId } = req.params
  const ticketRequests = await ticketRequestService.getTicketRequestsByUserId(userId)
  return res
    .status(StatusCodes.OK)
    .json(ApiResponse.success(ticketRequests, 'Lấy danh sách yêu cầu vé của người dùng thành công'))
})

/**
 * Lấy danh sách yêu cầu vé theo ID chuyến đi
 */

const getTicketRequestsByTripId = catchAsync(async (req, res) => {
  const { tripId } = req.params
  const ticketRequests = await ticketRequestService.getTicketRequestsByTripId(tripId)
  return res
    .status(StatusCodes.OK)
    .json(ApiResponse.success(ticketRequests, 'Lấy danh sách yêu cầu vé của chuyến đi thành công'))
})

/**
 * Lấy thông tin yêu cầu vé theo ID
 */
const getTicketRequestById = catchAsync(async (req, res) => {
  const { ticketRequestId } = req.params
  const ticketRequest = await ticketRequestService.getTicketRequestById(ticketRequestId)
  return res.status(StatusCodes.OK).json(ApiResponse.success(ticketRequest, 'Lấy thông tin yêu cầu vé thành công'))
})

/**
 * Cập nhật thông tin yêu cầu vé
 */
const updateTicketRequest = catchAsync(async (req, res) => {
  const { ticketRequestId } = req.params
  const updatedTicketRequest = await ticketRequestService.updateTicketRequest(ticketRequestId, req.body)
  return res.status(StatusCodes.OK).json(ApiResponse.success(updatedTicketRequest, 'Cập nhật yêu cầu vé thành công'))
})
/**
 * Xóa yêu cầu vé theo ID
 */
const deleteTicketRequest = catchAsync(async (req, res) => {
  const { ticketRequestId } = req.params
  await ticketRequestService.deleteTicketRequest(ticketRequestId)
  return res.status(StatusCodes.OK).json(
    ApiResponse.success({
      message: 'Xóa yêu cầu vé thành công'
    })
  )
})

export const ticketRequestController = {
  createTicketRequest,
  getTicketRequests,
  getTicketRequestById,
  updateTicketRequest,
  deleteTicketRequest,
  getTicketRequestsByUserId,
  getTicketRequestsByTripId
}
