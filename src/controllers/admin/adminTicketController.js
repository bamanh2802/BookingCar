import { ticketService } from '~/services/ticketService'
import ApiResponse from '~/utils/ApiResponse'
import { catchAsync } from '~/utils/catchAsync'

/**
 * Lấy danh sách vé (Admin)
 */
const getTickets = catchAsync(async (req, res) => {
  const { page = 1, limit = 10, search, tripId, userId, status, startDate, endDate } = req.query

  const filter = {}
  
  if (search) {
    filter.$or = [
      { ticketCode: { $regex: search, $options: 'i' } },
      { passengerName: { $regex: search, $options: 'i' } },
      { passengerPhone: { $regex: search, $options: 'i' } }
    ]
  }

  if (tripId) {
    filter.tripId = tripId
  }

  if (userId) {
    filter.userId = userId
  }

  if (status) {
    filter.status = status
  }

  if (startDate && endDate) {
    filter.createdAt = {
      $gte: new Date(startDate),
      $lte: new Date(endDate)
    }
  } else if (startDate) {
    filter.createdAt = { $gte: new Date(startDate) }
  } else if (endDate) {
    filter.createdAt = { $lte: new Date(endDate) }
  }

  const tickets = await ticketService.getTickets(filter, parseInt(page), parseInt(limit))
  return res.status(200).json(ApiResponse.success(tickets, 'Lấy danh sách vé thành công'))
})

/**
 * Tạo vé mới (Admin)
 */
const createTicket = catchAsync(async (req, res) => {
  const createdTicket = await ticketService.createTicket(req.body)
  return res.status(201).json(ApiResponse.created(createdTicket, 'Tạo vé thành công'))
})

/**
 * Cập nhật thông tin vé (Admin)
 */
const updateTicket = catchAsync(async (req, res) => {
  const { ticketId } = req.params
  const updatedTicket = await ticketService.updateTicket(ticketId, req.body)
  return res.status(200).json(ApiResponse.success(updatedTicket, 'Cập nhật thông tin vé thành công'))
})

/**
 * Lấy thông tin vé theo ID (Admin)
 */
const getTicketById = catchAsync(async (req, res) => {
  const { ticketId } = req.params
  const ticket = await ticketService.getTicketById(ticketId)
  return res.status(200).json(ApiResponse.success(ticket, 'Lấy thông tin vé thành công'))
})

/**
 * Xóa vé (Admin)
 */
const deleteTicket = catchAsync(async (req, res) => {
  const { ticketId } = req.params
  const result = await ticketService.deleteTicket(ticketId)
  return res.status(200).json(ApiResponse.success(result, 'Xóa vé thành công'))
})

/**
 * Xác nhận vé (Admin)
 */
const confirmTicket = catchAsync(async (req, res) => {
  const { ticketId } = req.params
  const confirmedTicket = await ticketService.updateTicket(ticketId, { 
    status: 'Confirmed',
    confirmedAt: new Date()
  })
  return res.status(200).json(ApiResponse.success(confirmedTicket, 'Xác nhận vé thành công'))
})

/**
 * Hủy vé (Admin)
 */
const cancelTicket = catchAsync(async (req, res) => {
  const { ticketId } = req.params
  const { reason } = req.body
  const cancelledTicket = await ticketService.updateTicket(ticketId, { 
    status: 'Cancelled',
    cancelReason: reason,
    cancelledAt: new Date()
  })
  return res.status(200).json(ApiResponse.success(cancelledTicket, 'Hủy vé thành công'))
})

/**
 * Hoàn tiền vé (Admin)
 */
const refundTicket = catchAsync(async (req, res) => {
  const { ticketId } = req.params
  const { refundAmount, reason } = req.body
  const refundedTicket = await ticketService.updateTicket(ticketId, { 
    status: 'Refunded',
    refundAmount,
    refundReason: reason,
    refundedAt: new Date()
  })
  return res.status(200).json(ApiResponse.success(refundedTicket, 'Hoàn tiền vé thành công'))
})

/**
 * Lấy danh sách vé theo chuyến đi (Admin)
 */
const getTicketsByTrip = catchAsync(async (req, res) => {
  const { tripId } = req.params
  const { page = 1, limit = 10 } = req.query
  
  const tickets = await ticketService.getTickets({ tripId }, parseInt(page), parseInt(limit))
  return res.status(200).json(ApiResponse.success(tickets, 'Lấy danh sách vé theo chuyến đi thành công'))
})

/**
 * Lấy danh sách vé theo người dùng (Admin)
 */
const getTicketsByUser = catchAsync(async (req, res) => {
  const { userId } = req.params
  const { page = 1, limit = 10 } = req.query
  
  const tickets = await ticketService.getTickets({ userId }, parseInt(page), parseInt(limit))
  return res.status(200).json(ApiResponse.success(tickets, 'Lấy danh sách vé theo người dùng thành công'))
})

export const adminTicketController = {
  getTickets,
  createTicket,
  updateTicket,
  getTicketById,
  deleteTicket,
  confirmTicket,
  cancelTicket,
  refundTicket,
  getTicketsByTrip,
  getTicketsByUser
} 