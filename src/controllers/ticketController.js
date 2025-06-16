import { catchAsync } from '~/utils/catchAsync'
import { StatusCodes } from 'http-status-codes'
import ApiResponse from '~/utils/ApiResponse'

import ticketService from '~/services/ticketService'
import { USER_ROLES } from '~/constants'

/**
 * Tạo mới vé
 */
const createTicket = catchAsync(async (req, res) => {
  const ticket = await ticketService.createTicket(req.body)
  return res.status(StatusCodes.CREATED).json(ApiResponse.created(ticket, 'Tạo vé thành công'))
})

/**
 * Lấy danh sách vé (dành cho admin, agent lv1,agent lv2)
 */
const getTickets = catchAsync(async (req, res) => {
  const { page, limit } = req.query
  let filter = req.query.filter || {}
  //Lấy danh sách vé dc tạo bởi agent lv2 (dành cho agent lv2)
  if (req.user.roleName === USER_ROLES.AGENT_LV2) {
    filter.createdBy = req.user._id
  }
  const tickets = await ticketService.getTickets(filter, page, limit)
  return res.status(StatusCodes.OK).json(ApiResponse.success(tickets, 'Lấy danh sách vé thành công'))
})

/**
 * Lấy vé theo ID
 */
const getTicketById = catchAsync(async (req, res) => {
  const { ticketId } = req.params
  const ticket = await ticketService.getTicketById(ticketId)
  return res.status(StatusCodes.OK).json(ApiResponse.success(ticket, 'Lấy thông tin vé thành công'))
})

/**
 * Cập nhật vé
 */

const updateTicket = catchAsync(async (req, res) => {
  const { ticketId } = req.params
  const updatedTicket = await ticketService.updateTicket(ticketId, req.body)
  return res.status(StatusCodes.OK).json(ApiResponse.success(updatedTicket, 'Cập nhật vé thành công'))
})

/**
 * Xóa vé
 */
const deleteTicket = catchAsync(async (req, res) => {
  const { ticketId } = req.params
  await ticketService.deleteTicket(ticketId)
  return res.status(StatusCodes.NO_CONTENT).json(ApiResponse.noContent('Xóa vé thành công'))
})

/**
 * Lấy vé theo ID người dùng
 */

const getTicketsByUserId = catchAsync(async (req, res) => {
  const { userId } = req.params
  const tickets = await ticketService.getTicketsByUserId(userId)
  return res.status(StatusCodes.OK).json(ApiResponse.success(tickets, 'Lấy danh sách vé của người dùng thành công'))
})

/**
 * Lấy vé theo ID chuyến đi
 */
const getTicketsByTripId = catchAsync(async (req, res) => {
  const { tripId } = req.params
  const tickets = await ticketService.getTicketsByTripId(tripId)
  return res.status(StatusCodes.OK).json(ApiResponse.success(tickets, 'Lấy danh sách vé của chuyến đi thành công'))
})

/**
 * Lấy vé theo ID người dùng và ID chuyến đi
 */
const getTicketsByUserIdAndTripId = catchAsync(async (req, res) => {
  const { userId, tripId } = req.params
  const tickets = await ticketService.getTicketsByUserIdAndTripId(userId, tripId)
  return res
    .status(StatusCodes.OK)
    .json(ApiResponse.success(tickets, 'Lấy danh sách vé của người dùng và chuyến đi thành công'))
})
export const ticketController = {
  createTicket,
  getTickets,
  getTicketById,
  updateTicket,
  deleteTicket,
  getTicketsByUserId,
  getTicketsByTripId,
  getTicketsByUserIdAndTripId
}
