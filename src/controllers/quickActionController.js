import { StatusCodes } from 'http-status-codes'
import { quickActionService } from '~/services/quickActionService'
import ApiResponse from '~/utils/ApiResponse'
import { catchAsync } from '~/utils/catchAsync'
const createQuickAction = catchAsync(async (req, res) => {
  const quickAction = await quickActionService.createQuickAction(req.body)
  return res.status(StatusCodes.CREATED).json(ApiResponse.success(quickAction, 'Tạo yêu cầu nhanh thành công'))
})

const updateQuickAction = catchAsync(async (req, res) => {
  const { quickActionId } = req.params

  const quickAction = await quickActionService.updateQuickAction(quickActionId, req.body)
  return res.status(StatusCodes.OK).json(ApiResponse.success(quickAction, 'Cập nhật yêu cầu nhanh thành công'))
})

const getAllQuickAction = catchAsync(async (req, res) => {
  const { page = 1, limit = 10, ...otherFilters } = req.query

  // Xử lý ép kiểu
  const filter = { ...otherFilters }

  if (filter.isDone === 'true') filter.isDone = true
  else if (filter.isDone === 'false') filter.isDone = false
  const quickActions = await quickActionService.getAllQuickAction(filter, parseInt(page), parseInt(limit))

  return res.status(StatusCodes.OK).json(ApiResponse.success(quickActions, 'Lấy danh sách yêu cầu nhanh thành công'))
})
export const quickActionController = { createQuickAction, updateQuickAction, getAllQuickAction }
