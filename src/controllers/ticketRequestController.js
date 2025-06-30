import { USER_ROLES } from '~/constants'
import { ticketRequestService } from '~/services/ticketRequestService'
import { userService } from '~/services/userService'

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
  const { page = 1, limit = 10, ...restQuery } = req.query
  let filter = req.query.filter || {}

  // Hỗ trợ truyền trực tiếp nhiều trường filter qua query string
  const allowedFields = ['status', 'userId', 'tripId', 'createdAt', 'updatedAt', 'tittleRequest']
  allowedFields.forEach((field) => {
    if (restQuery[field]) filter[field] = restQuery[field]
  })
  if (req.user.roleName === USER_ROLES.AGENT_LV2) {
    // Nếu là AGENT_LV2, chỉ lấy vé do chính user đó tạo
    filter.createdBy = req.user._id
    filter.userId = req.user._id
  } else if (req.user.roleName === USER_ROLES.AGENT_LV1) {
    // Nếu là AGENT_LV1, lấy vé do chính user đó tạo và các AGENT_LV2 do user này quản lý
    // Giả sử có hàm userService.getAgentLv2ByAgentLv1Id trả về danh sách AGENT_LV2 do AGENT_LV1 này quản lý
    const getAgentLv2List = await userService.getUsersCreatedByParent(req.user._id)
    const agentLv2List = getAgentLv2List.results
    if (!agentLv2List || agentLv2List.length === 0) {
      // Nếu không có AGENT_LV2 nào, chỉ lấy vé do chính user đó tạo
      filter.createdBy = req.user._id
    }
    const agentLv2Ids = agentLv2List.map((agent) => agent._id)
    filter.createdBy = [req.user._id, ...agentLv2Ids]
    filter.userId = [req.user._id, ...agentLv2Ids]
  } else if (req.user.roleName === USER_ROLES.CLIENT) {
    filter.userId = req.user._id
  }
  const ticketRequests = await ticketRequestService.getTicketRequests(filter, parseInt(page), parseInt(limit))
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
  if (req.userRole?.roleName === 'Client') {
    // Xoá trường status, tittleRequest nếu có khi người dùng là Client
    delete req.body.status
    delete req.body.tittleRequest
  }

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

/**
 * Yêu cầu hủy vé
 */
const cancelTicketRequest = catchAsync(async (req, res) => {
  const currentUser = req.user
  const ticketRequest = await ticketRequestService.createTicketRequest(req.body, currentUser)
  return res.status(StatusCodes.CREATED).json(ApiResponse.created(ticketRequest, 'Yêu cầu hủy vé thành công'))
})

export const ticketRequestController = {
  createTicketRequest,
  getTicketRequests,
  getTicketRequestById,
  updateTicketRequest,
  deleteTicketRequest,
  getTicketRequestsByUserId,
  getTicketRequestsByTripId,
  cancelTicketRequest
}
