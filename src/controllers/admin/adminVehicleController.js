import { vehicleService } from '~/services/vehicleService'
import ApiResponse from '~/utils/ApiResponse'
import { catchAsync } from '~/utils/catchAsync'

/**
 * Lấy danh sách phương tiện (Admin)
 */
const getVehicles = catchAsync(async (req, res) => {
  const { page = 1, limit = 10, search, companyId, vehicleType, status } = req.query

  const filter = {}
  
  if (search) {
    filter.$or = [
      { licensePlate: { $regex: search, $options: 'i' } },
      { vehicleModel: { $regex: search, $options: 'i' } }
    ]
  }

  if (companyId) {
    filter.companyId = companyId
  }

  if (vehicleType) {
    filter.vehicleType = vehicleType
  }

  if (status) {
    filter.status = status
  }

  const vehicles = await vehicleService.getVehicles(filter, parseInt(page), parseInt(limit))
  return res.status(200).json(ApiResponse.success(vehicles, 'Lấy danh sách phương tiện thành công'))
})

/**
 * Tạo phương tiện mới (Admin)
 */
const createVehicle = catchAsync(async (req, res) => {
  const createdVehicle = await vehicleService.createVehicle(req.body)
  return res.status(201).json(ApiResponse.created(createdVehicle, 'Tạo phương tiện thành công'))
})

/**
 * Cập nhật thông tin phương tiện (Admin)
 */
const updateVehicle = catchAsync(async (req, res) => {
  const { vehicleId } = req.params
  const updatedVehicle = await vehicleService.updateVehicle(vehicleId, req.body)
  return res.status(200).json(ApiResponse.success(updatedVehicle, 'Cập nhật thông tin phương tiện thành công'))
})

/**
 * Lấy thông tin phương tiện theo ID (Admin)
 */
const getVehicleById = catchAsync(async (req, res) => {
  const { vehicleId } = req.params
  const vehicle = await vehicleService.getVehicleById(vehicleId)
  return res.status(200).json(ApiResponse.success(vehicle, 'Lấy thông tin phương tiện thành công'))
})

/**
 * Xóa phương tiện (Admin)
 */
const deleteVehicle = catchAsync(async (req, res) => {
  const { vehicleId } = req.params
  const result = await vehicleService.deleteVehicle(vehicleId)
  return res.status(200).json(ApiResponse.success(result, 'Xóa phương tiện thành công'))
})

/**
 * Kích hoạt/Vô hiệu hóa phương tiện (Admin)
 */
const toggleVehicleStatus = catchAsync(async (req, res) => {
  const { vehicleId } = req.params
  const { isActive } = req.body
  const updatedVehicle = await vehicleService.updateVehicle(vehicleId, { isActive })
  return res.status(200).json(ApiResponse.success(updatedVehicle, 'Cập nhật trạng thái phương tiện thành công'))
})

/**
 * Lấy danh sách phương tiện theo công ty (Admin)
 */
const getVehiclesByCompany = catchAsync(async (req, res) => {
  const { companyId } = req.params
  const { page = 1, limit = 10 } = req.query
  
  const vehicles = await vehicleService.getVehicles({ companyId }, parseInt(page), parseInt(limit))
  return res.status(200).json(ApiResponse.success(vehicles, 'Lấy danh sách phương tiện theo công ty thành công'))
})

export const adminVehicleController = {
  getVehicles,
  createVehicle,
  updateVehicle,
  getVehicleById,
  deleteVehicle,
  toggleVehicleStatus,
  getVehiclesByCompany
} 