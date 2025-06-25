import { catchAsync } from '~/utils/catchAsync'
import { StatusCodes } from 'http-status-codes'
import ApiResponse from '~/utils/ApiResponse'

import ticketService from '~/services/ticketService'
import { USER_ROLES } from '~/constants'
import { userService } from '~/services/userService'

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
const getTicketsCreatedBy = catchAsync(async (req, res) => {
  const { page, limit } = req.query
  let filter = req.query.filter || {}

  if (req.user.roleName === USER_ROLES.AGENT_LV2) {
    // Nếu là AGENT_LV2, chỉ lấy vé do chính user đó tạo
    filter.createdBy = req.user._id
  } else if (req.user.roleName === USER_ROLES.AGENT_LV1) {
    // Nếu là AGENT_LV1, lấy vé do chính user đó tạo và các AGENT_LV2 do user này quản lý
    // Giả sử có hàm userService.getAgentLv2ByAgentLv1Id trả về danh sách AGENT_LV2 do AGENT_LV1 này quản lý
    const agentLv2List = await userService.getAgentLv2ByAgentLv1Id(req.user._id)
    if (!agentLv2List || agentLv2List.length === 0) {
      // Nếu không có AGENT_LV2 nào, chỉ lấy vé do chính user đó tạo
      filter.createdBy = req.user._id
    }
    const agentLv2Ids = agentLv2List.map((agent) => agent._id)
    filter.createdBy = [req.user._id, ...agentLv2Ids]
  }
  const tickets = await ticketService.getTicketsCreatedBy(filter, page, limit)
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
  getTicketsCreatedBy,
  getTicketById,
  updateTicket,
  deleteTicket,
  getTicketsByUserId,
  getTicketsByTripId,
  getTicketsByUserIdAndTripId
}
