import { vehicleService } from '~/services/vehicleService'
import { StatusCodes } from 'http-status-codes'
import ApiResponse from '~/utils/ApiResponse'

/**
 * @desc    Lấy danh sách vehicles
 * @route   GET /admin/vehicles
 * @access  Admin, AgentLv1, AgentLv2
 */
const getVehicles = async (req, res) => {
  const { page = 1, limit = 10, companyId, status, type, brand } = req.query
  
  const filter = {}
  if (companyId) filter.companyId = companyId
  if (status) filter.status = status
  if (type) filter.type = type
  if (brand) filter.brand = brand

  const data = await vehicleService.getVehicles(filter, parseInt(page), parseInt(limit))
  
  return res.status(StatusCodes.OK).json(
    new ApiResponse(StatusCodes.OK, data, 'Get vehicles successfully')
  )
}

/**
 * @desc    Lấy thông tin vehicle theo ID
 * @route   GET /admin/vehicles/:id
 * @access  Admin, AgentLv1, AgentLv2
 */
const getVehicleById = async (req, res) => {
  const { id } = req.params
  const vehicle = await vehicleService.getVehicleById(id)
  
  return res.status(StatusCodes.OK).json(
    new ApiResponse(StatusCodes.OK, vehicle, 'Get vehicle details successfully')
  )
}

/**
 * @desc    Tạo vehicle mới
 * @route   POST /admin/vehicles
 * @access  Admin
 */
const createVehicle = async (req, res) => {
  const vehicleData = req.body
  const newVehicle = await vehicleService.createVehicle(vehicleData)
  
  return res.status(StatusCodes.CREATED).json(
    new ApiResponse(StatusCodes.CREATED, newVehicle, 'Vehicle created successfully')
  )
}

/**
 * @desc    Cập nhật vehicle
 * @route   PATCH /admin/vehicles/:id
 * @access  Admin
 */
const updateVehicle = async (req, res) => {
  const { id } = req.params
  const updateData = req.body
  
  const updatedVehicle = await vehicleService.updateVehicle(id, updateData)
  
  return res.status(StatusCodes.OK).json(
    new ApiResponse(StatusCodes.OK, updatedVehicle, 'Vehicle updated successfully')
  )
}

/**
 * @desc    Xóa vehicle
 * @route   DELETE /admin/vehicles/:id
 * @access  Admin
 */
const deleteVehicle = async (req, res) => {
  const { id } = req.params
  await vehicleService.deleteVehicle(id)
  
  return res.status(StatusCodes.OK).json(
    new ApiResponse(StatusCodes.OK, null, 'Vehicle deleted successfully')
  )
}

/**
 * @desc    Lấy vehicles của một company
 * @route   GET /admin/companies/:companyId/vehicles
 * @access  Admin, AgentLv1, AgentLv2
 */
const getVehiclesByCompany = async (req, res) => {
  const { companyId } = req.params
  const { status, type } = req.query
  
  const filter = {}
  if (status) filter.status = status
  if (type) filter['specifications.type'] = type
  
  const vehicles = await vehicleService.getVehiclesByCompany(companyId, filter)
  
  return res.status(StatusCodes.OK).json(
    new ApiResponse(StatusCodes.OK, vehicles, 'Get company vehicles successfully')
  )
}

/**
 * @desc    Lấy vehicles available
 * @route   GET /admin/vehicles/available
 * @access  Admin, AgentLv1, AgentLv2
 */
const getAvailableVehicles = async (req, res) => {
  const { companyId } = req.query
  const vehicles = await vehicleService.getAvailableVehicles(companyId)
  
  return res.status(StatusCodes.OK).json(
    new ApiResponse(StatusCodes.OK, vehicles, 'Get available vehicles successfully')
  )
}

/**
 * @desc    Lấy thống kê vehicles
 * @route   GET /admin/vehicles/statistics
 * @access  Admin, AgentLv1, AgentLv2
 */
const getVehicleStatistics = async (req, res) => {
  const { companyId } = req.query
  const stats = await vehicleService.getVehicleStatistics(companyId)
  
  return res.status(StatusCodes.OK).json(
    new ApiResponse(StatusCodes.OK, stats, 'Get vehicle statistics successfully')
  )
}

export const vehicleController = {
  getVehicles,
  getVehicleById,
  createVehicle,
  updateVehicle,
  deleteVehicle,
  getVehiclesByCompany,
  getAvailableVehicles,
  getVehicleStatistics
} 