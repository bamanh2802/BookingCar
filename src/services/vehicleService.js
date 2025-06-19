import vehicleRepository from '~/repositories/vehicleRepository'
import carCompanyRepository from '~/repositories/carCompanyRepository'
import { NotFoundError, ConflictError, ValidationError } from '~/utils/errors'
import { pickVehicle } from '~/utils/formatter'

/**
 * Lấy danh sách vehicles với filter và pagination
 */
const getVehicles = async (filter = {}, page = 1, limit = 10) => {
  // Build filter object
  const queryFilter = {}
  
  if (filter.companyId) {
    queryFilter.companyId = filter.companyId
  }
  
  if (filter.status) {
    queryFilter.status = filter.status
  }
  
  if (filter.type) {
    queryFilter['specifications.type'] = filter.type
  }
  
  if (filter.brand) {
    queryFilter['specifications.brand'] = new RegExp(filter.brand, 'i')
  }

  return await vehicleRepository.findAll(queryFilter, page, limit)
}

/**
 * Lấy thông tin vehicle theo ID
 */
const getVehicleById = async (vehicleId) => {
  const vehicle = await vehicleRepository.findById(vehicleId)
  if (!vehicle) {
    throw new NotFoundError('Vehicle not found')
  }
  return vehicle
}

/**
 * Tạo vehicle mới
 */
const createVehicle = async (vehicleData) => {
  // Kiểm tra company có tồn tại không
  const company = await carCompanyRepository.findById(vehicleData.companyId)
  if (!company) {
    throw new NotFoundError('Car company not found')
  }

  // Kiểm tra biển số xe đã tồn tại chưa
  const existingVehicle = await vehicleRepository.findByLicensePlate(vehicleData.licensePlate)
  if (existingVehicle) {
    throw new ConflictError('License plate already exists')
  }

  // Validate seatMap nếu có
  if (vehicleData.seatMap && vehicleData.seatMap.length > 0) {
    const seatCodes = vehicleData.seatMap.map(seat => seat.code)
    const uniqueSeatCodes = [...new Set(seatCodes)]
    
    if (seatCodes.length !== uniqueSeatCodes.length) {
      throw new ValidationError('Duplicate seat codes are not allowed')
    }
  }

  const newVehicle = await vehicleRepository.create(vehicleData)
  return pickVehicle(newVehicle)
}

/**
 * Cập nhật vehicle
 */
const updateVehicle = async (vehicleId, updateData) => {
  // Kiểm tra vehicle có tồn tại không
  const existingVehicle = await vehicleRepository.findById(vehicleId)
  if (!existingVehicle) {
    throw new NotFoundError('Vehicle not found')
  }

  // Nếu cập nhật biển số xe, kiểm tra trùng lặp
  if (updateData.licensePlate) {
    const vehicleWithSamePlate = await vehicleRepository.findByLicensePlate(updateData.licensePlate)
    if (vehicleWithSamePlate && vehicleWithSamePlate._id.toString() !== vehicleId) {
      throw new ConflictError('License plate already exists')
    }
  }

  // Validate seatMap nếu cập nhật
  if (updateData.seatMap && updateData.seatMap.length > 0) {
    const seatCodes = updateData.seatMap.map(seat => seat.code)
    const uniqueSeatCodes = [...new Set(seatCodes)]
    
    if (seatCodes.length !== uniqueSeatCodes.length) {
      throw new ValidationError('Duplicate seat codes are not allowed')
    }
  }

  const updatedVehicle = await vehicleRepository.updateById(vehicleId, updateData)
  return pickVehicle(updatedVehicle)
}

/**
 * Xóa vehicle
 */
const deleteVehicle = async (vehicleId) => {
  const existingVehicle = await vehicleRepository.findById(vehicleId)
  if (!existingVehicle) {
    throw new NotFoundError('Vehicle not found')
  }

  // TODO: Kiểm tra xe có đang được sử dụng trong trip không
  // const activeTrips = await tripRepository.findByVehicleId(vehicleId, { status: 'active' })
  // if (activeTrips.length > 0) {
  //   throw new ConflictError('Cannot delete vehicle that is currently assigned to active trips')
  // }

  return await vehicleRepository.deleteById(vehicleId)
}

/**
 * Lấy vehicles của một company
 */
const getVehiclesByCompany = async (companyId, filter = {}) => {
  const company = await carCompanyRepository.findById(companyId)
  if (!company) {
    throw new NotFoundError('Car company not found')
  }

  return await vehicleRepository.findByCompanyId(companyId, filter)
}

/**
 * Lấy vehicles available
 */
const getAvailableVehicles = async (companyId = null) => {
  return await vehicleRepository.findAvailable(companyId)
}

/**
 * Lấy thống kê vehicles
 */
const getVehicleStatistics = async (companyId = null) => {
  const [statusStats, totalCount] = await Promise.all([
    vehicleRepository.countByStatus(companyId),
    companyId ? vehicleRepository.countByCompany(companyId) : vehicleRepository.findAll({}, 1, 1)
  ])

  const stats = {
    total: companyId ? totalCount : totalCount.pagination.total,
    byStatus: {}
  }

  // Format status statistics
  statusStats.forEach(stat => {
    stats.byStatus[stat._id] = stat.count
  })

  // Ensure all statuses are represented
  const allStatuses = ['active', 'maintenance', 'inactive', 'retired']
  allStatuses.forEach(status => {
    if (!stats.byStatus[status]) {
      stats.byStatus[status] = 0
    }
  })

  return stats
}

export const vehicleService = {
  getVehicles,
  getVehicleById,
  createVehicle,
  updateVehicle,
  deleteVehicle,
  getVehiclesByCompany,
  getAvailableVehicles,
  getVehicleStatistics
} 