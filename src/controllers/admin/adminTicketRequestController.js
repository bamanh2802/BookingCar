import { ticketRequestService } from '~/services/ticketRequestService'
import ApiResponse from '~/utils/ApiResponse'
import { catchAsync } from '~/utils/catchAsync'

/**
 * Lấy danh sách yêu cầu vé (Admin)
 */
const getTicketRequests = catchAsync(async (req, res) => {
  const { page = 1, limit = 10, search, userId, status, requestType, startDate, endDate } = req.query

  const filter = {}
  
  if (search) {
    filter.$or = [
      { requestId: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } }
    ]
  }

  if (userId) {
    filter.userId = userId
  }

  if (status) {
    filter.status = status
  }

  if (requestType) {
    filter.requestType = requestType
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

  const ticketRequests = await ticketRequestService.getTicketRequests(filter, parseInt(page), parseInt(limit))
  return res.status(200).json(ApiResponse.success(ticketRequests, 'Lấy danh sách yêu cầu vé thành công'))
})

/**
 * Tạo yêu cầu vé mới (Admin)
 */
const createTicketRequest = catchAsync(async (req, res) => {
  const createdTicketRequest = await ticketRequestService.createTicketRequest(req.body)
  return res.status(201).json(ApiResponse.created(createdTicketRequest, 'Tạo yêu cầu vé thành công'))
})

/**
 * Cập nhật thông tin yêu cầu vé (Admin)
 */
const updateTicketRequest = catchAsync(async (req, res) => {
  const { requestId } = req.params
  const updatedTicketRequest = await ticketRequestService.updateTicketRequest(requestId, req.body)
  return res.status(200).json(ApiResponse.success(updatedTicketRequest, 'Cập nhật thông tin yêu cầu vé thành công'))
})

/**
 * Lấy thông tin yêu cầu vé theo ID (Admin)
 */
const getTicketRequestById = catchAsync(async (req, res) => {
  const { requestId } = req.params
  const ticketRequest = await ticketRequestService.getTicketRequestById(requestId)
  return res.status(200).json(ApiResponse.success(ticketRequest, 'Lấy thông tin yêu cầu vé thành công'))
})

/**
 * Xóa yêu cầu vé (Admin)
 */
const deleteTicketRequest = catchAsync(async (req, res) => {
  const { requestId } = req.params
  const result = await ticketRequestService.deleteTicketRequest(requestId)
  return res.status(200).json(ApiResponse.success(result, 'Xóa yêu cầu vé thành công'))
})

/**
 * Phê duyệt yêu cầu vé (Admin)
 */
const approveTicketRequest = catchAsync(async (req, res) => {
  const { requestId } = req.params
  const { approvalNote } = req.body
  const approvedRequest = await ticketRequestService.updateTicketRequest(requestId, { 
    status: 'Approved',
    approvedBy: req.user._id,
    approvedAt: new Date(),
    approvalNote
  })
  return res.status(200).json(ApiResponse.success(approvedRequest, 'Phê duyệt yêu cầu vé thành công'))
})

/**
 * Từ chối yêu cầu vé (Admin)
 */
const rejectTicketRequest = catchAsync(async (req, res) => {
  const { requestId } = req.params
  const { rejectionReason } = req.body
  const rejectedRequest = await ticketRequestService.updateTicketRequest(requestId, { 
    status: 'Rejected',
    rejectedBy: req.user._id,
    rejectedAt: new Date(),
    rejectionReason
  })
  return res.status(200).json(ApiResponse.success(rejectedRequest, 'Từ chối yêu cầu vé thành công'))
})

/**
 * Xử lý yêu cầu vé (Admin)
 */
const processTicketRequest = catchAsync(async (req, res) => {
  const { requestId } = req.params
  const { processNote } = req.body
  const processedRequest = await ticketRequestService.updateTicketRequest(requestId, { 
    status: 'Processing',
    processedBy: req.user._id,
    processedAt: new Date(),
    processNote
  })
  return res.status(200).json(ApiResponse.success(processedRequest, 'Bắt đầu xử lý yêu cầu vé thành công'))
})

/**
 * Hoàn thành yêu cầu vé (Admin)
 */
const completeTicketRequest = catchAsync(async (req, res) => {
  const { requestId } = req.params
  const { completionNote } = req.body
  const completedRequest = await ticketRequestService.updateTicketRequest(requestId, { 
    status: 'Completed',
    completedBy: req.user._id,
    completedAt: new Date(),
    completionNote
  })
  return res.status(200).json(ApiResponse.success(completedRequest, 'Hoàn thành yêu cầu vé thành công'))
})

/**
 * Lấy danh sách yêu cầu vé theo người dùng (Admin)
 */
const getTicketRequestsByUser = catchAsync(async (req, res) => {
  const { userId } = req.params
  const { page = 1, limit = 10 } = req.query
  
  const ticketRequests = await ticketRequestService.getTicketRequests({ userId }, parseInt(page), parseInt(limit))
  return res.status(200).json(ApiResponse.success(ticketRequests, 'Lấy danh sách yêu cầu vé theo người dùng thành công'))
})

/**
 * Lấy thống kê yêu cầu vé (Admin)
 */
const getTicketRequestStats = catchAsync(async (req, res) => {
  const { startDate, endDate } = req.query
  
  const dateFilter = {}
  if (startDate && endDate) {
    dateFilter.createdAt = {
      $gte: new Date(startDate),
      $lte: new Date(endDate)
    }
  }

  const stats = await ticketRequestService.getTicketRequestStats(dateFilter)
  return res.status(200).json(ApiResponse.success(stats, 'Lấy thống kê yêu cầu vé thành công'))
})

export const adminTicketRequestController = {
  getTicketRequests,
  createTicketRequest,
  updateTicketRequest,
  getTicketRequestById,
  deleteTicketRequest,
  approveTicketRequest,
  rejectTicketRequest,
  processTicketRequest,
  completeTicketRequest,
  getTicketRequestsByUser,
  getTicketRequestStats
} 