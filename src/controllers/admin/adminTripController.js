import { tripService } from '~/services/tripService'
import ApiResponse from '~/utils/ApiResponse'
import { catchAsync } from '~/utils/catchAsync'

/**
 * Lấy danh sách chuyến đi (Admin)
 */
const getTrips = catchAsync(async (req, res) => {
  const { page = 1, limit = 10, search, companyId, vehicleId, status, startDate, endDate } = req.query

  const filter = {}
  
  if (search) {
    filter.$or = [
      { departure: { $regex: search, $options: 'i' } },
      { destination: { $regex: search, $options: 'i' } }
    ]
  }

  if (companyId) {
    filter.companyId = companyId
  }

  if (vehicleId) {
    filter.vehicleId = vehicleId
  }

  if (status) {
    filter.status = status
  }

  if (startDate && endDate) {
    filter.departureTime = {
      $gte: new Date(startDate),
      $lte: new Date(endDate)
    }
  } else if (startDate) {
    filter.departureTime = { $gte: new Date(startDate) }
  } else if (endDate) {
    filter.departureTime = { $lte: new Date(endDate) }
  }

  const trips = await tripService.getTrips(filter, parseInt(page), parseInt(limit))
  return res.status(200).json(ApiResponse.success(trips, 'Lấy danh sách chuyến đi thành công'))
})

/**
 * Tạo chuyến đi mới (Admin)
 */
const createTrip = catchAsync(async (req, res) => {
  const createdTrip = await tripService.createTrip(req.body)
  return res.status(201).json(ApiResponse.created(createdTrip, 'Tạo chuyến đi thành công'))
})

/**
 * Cập nhật thông tin chuyến đi (Admin)
 */
const updateTrip = catchAsync(async (req, res) => {
  const { tripId } = req.params
  const updatedTrip = await tripService.updateTrip(tripId, req.body)
  return res.status(200).json(ApiResponse.success(updatedTrip, 'Cập nhật thông tin chuyến đi thành công'))
})

/**
 * Lấy thông tin chuyến đi theo ID (Admin)
 */
const getTripById = catchAsync(async (req, res) => {
  const { tripId } = req.params
  const trip = await tripService.getTripById(tripId)
  return res.status(200).json(ApiResponse.success(trip, 'Lấy thông tin chuyến đi thành công'))
})

/**
 * Xóa chuyến đi (Admin)
 */
const deleteTrip = catchAsync(async (req, res) => {
  const { tripId } = req.params
  const result = await tripService.deleteTrip(tripId)
  return res.status(200).json(ApiResponse.success(result, 'Xóa chuyến đi thành công'))
})

/**
 * Hủy chuyến đi (Admin)
 */
const cancelTrip = catchAsync(async (req, res) => {
  const { tripId } = req.params
  const { reason } = req.body
  const cancelledTrip = await tripService.updateTrip(tripId, { 
    status: 'Cancelled',
    cancelReason: reason,
    cancelledAt: new Date()
  })
  return res.status(200).json(ApiResponse.success(cancelledTrip, 'Hủy chuyến đi thành công'))
})

/**
 * Hoàn thành chuyến đi (Admin)
 */
const completeTrip = catchAsync(async (req, res) => {
  const { tripId } = req.params
  const completedTrip = await tripService.updateTrip(tripId, { 
    status: 'Completed',
    completedAt: new Date()
  })
  return res.status(200).json(ApiResponse.success(completedTrip, 'Hoàn thành chuyến đi thành công'))
})

/**
 * Lấy danh sách chuyến đi theo công ty (Admin)
 */
const getTripsByCompany = catchAsync(async (req, res) => {
  const { companyId } = req.params
  const { page = 1, limit = 10 } = req.query
  
  const trips = await tripService.getTrips({ companyId }, parseInt(page), parseInt(limit))
  return res.status(200).json(ApiResponse.success(trips, 'Lấy danh sách chuyến đi theo công ty thành công'))
})

/**
 * Lấy danh sách chuyến đi theo phương tiện (Admin)
 */
const getTripsByVehicle = catchAsync(async (req, res) => {
  const { vehicleId } = req.params
  const { page = 1, limit = 10 } = req.query
  
  const trips = await tripService.getTrips({ vehicleId }, parseInt(page), parseInt(limit))
  return res.status(200).json(ApiResponse.success(trips, 'Lấy danh sách chuyến đi theo phương tiện thành công'))
})

export const adminTripController = {
  getTrips,
  createTrip,
  updateTrip,
  getTripById,
  deleteTrip,
  cancelTrip,
  completeTrip,
  getTripsByCompany,
  getTripsByVehicle
} 