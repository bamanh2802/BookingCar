import { StatusCodes } from 'http-status-codes'
import { tripService } from '~/services/tripService'
import ApiResponse from '~/utils/ApiResponse'
import { catchAsync } from '~/utils/catchAsync'

/**
 *Lây danh sách chuyến đi theo ngayf hiện tại
 */

const getTrips = catchAsync(async (req, res) => {
  const { page = 1, limit = 99, ...reqQuery } = req.query
  const trips = await tripService.getTrips(reqQuery, parseInt(page), parseInt(limit))
  res.status(StatusCodes.OK).json(ApiResponse.success(trips, 'Lấy danh sách chuyến đi thành công'))
})

/**
 * Tạo mới chuyến đi
 */
const createTrip = catchAsync(async (req, res) => {
  const createdTrip = await tripService.createTrip(req.body)
  return res.status(StatusCodes.CREATED).json(ApiResponse.created(createdTrip, 'Tạo chuyến đi thành công'))
})

/**
 * Lấy thông tin chuyến đi theo ID
 */
const getTripById = catchAsync(async (req, res) => {
  const { tripId } = req.params
  const trip = await tripService.getTripById(tripId)
  return res.status(StatusCodes.OK).json(ApiResponse.success(trip, 'Lấy thông tin chuyến đi thành công'))
})

/**
 * Cập nhật thông tin chuyến đi
 */

const updateTrip = catchAsync(async (req, res) => {
  const { tripId } = req.params
  const updatedTrip = await tripService.updateTrip(tripId, req.body)
  return res.status(StatusCodes.OK).json(ApiResponse.success(updatedTrip, 'Cập nhật thông tin chuyến đi thành công'))
})

/**
 * Xóa chuyến đi
 */

const deleteTrip = catchAsync(async (req, res) => {
  const { tripId } = req.params
  await tripService.deleteTrip(tripId)
  return res.status(StatusCodes.OK).json(ApiResponse.success(null, 'Xóa chuyến đi thành công'))
})

export const tripController = { createTrip, getTrips, getTripById, updateTrip, deleteTrip }
