import { StatusCodes } from 'http-status-codes'
import { commissionService } from '~/services/commissionService'
import ApiResponse from '~/utils/ApiResponse'
import { catchAsync } from '~/utils/catchAsync'

// Cập nhật commission cho role, chỉ admin mới thao tác
const updateCommission = catchAsync(async (req, res) => {
  const { roleId } = req.params
  const { percent } = req.body

  const updatedData = await commissionService.updateCommission(roleId, parseInt(percent))

  return res.status(StatusCodes.OK).json(ApiResponse.success(updatedData, 'Cập nhật hoa hồng thành công '))
})

//Lấy toàn bộ danh sách hoa hồng
const getAllCommissionsWithRoles = catchAsync(async (req, res) => {
  const commissions = await commissionService.getAllCommissionsWithRoles()

  res.status(StatusCodes.OK).json(ApiResponse.success(commissions, 'Lấy danh sách hoa hồng thành công'))
})

export const commissionController = { updateCommission, getAllCommissionsWithRoles }
