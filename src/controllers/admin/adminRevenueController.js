import { catchAsync } from '~/utils/catchAsync'
import { adminRevenueService } from '~/services/adminRevenueService'
import ApiResponse from '~/utils/ApiResponse'
import { StatusCodes } from 'http-status-codes'
import { USER_ROLES } from '~/constants'
import { AuthenticationError, ConflictError } from '~/utils/errors'

// Các khoảng thời gian hợp lệ
const VALID_PERIODS = ['7days', '1month', '12months']

const getAllRevenues = catchAsync(async (req, res) => {
  const userId = req.user._id || req.query?.userId
  const roleName = req.user.roleName || req.query?.roleName
  const period = req.query.period || '7days'
  if (!VALID_PERIODS.includes(period)) {
    throw new ConflictError('Mốc thời gian không hợp lệ')
  }

  let revenue

  switch (roleName) {
    case USER_ROLES.ADMIN:
      revenue = await adminRevenueService.getAdminRevenue(period)
      break
    case USER_ROLES.AGENT_LV1:
      revenue = await adminRevenueService.getRevenueAgentsLv1(userId, period)
      break
    case USER_ROLES.AGENT_LV2:
      revenue = await adminRevenueService.getRevenueAgentsLv2(userId, period)
      break

    default:
      throw new AuthenticationError('Bạn không có quyền truy cập vào đường dẫn này')
  }
  return res.status(StatusCodes.OK).json(ApiResponse.success(revenue, 'Lấy doanh thu thành công'))
})

const getRevenueTicketType = catchAsync(async (req, res) => {
  const { monthYear } = req.query || '7days'
  const results = await adminRevenueService.getRevenueTicketType(monthYear)
  return res.status(StatusCodes.OK).json(ApiResponse.success(results, 'Lấy doanh thu theo loại vé thành công'))
})

const getTopAgentLv1ByRevenue = catchAsync(async (req, res) => {
  const { monthYear } = req.query || '7days'
  const { limit = 5 } = req.query

  const results = await adminRevenueService.getTopAgentLv1ByRevenue(monthYear, limit)
  return res
    .status(StatusCodes.OK)
    .json(ApiResponse.success(results, `Lấy danh sách  ${limit} đại lí cấp 1 có donah thu cao nhất thành công`))
})

export const adminRevenueController = { getAllRevenues, getRevenueTicketType, getTopAgentLv1ByRevenue }
