import mongoose from 'mongoose'
import carCompanyRepository from '~/repositories/carCompanyRepository'
import seatMapRepository from '~/repositories/seatMapRepository'
import tripRespository from '~/repositories/tripRepository'
import { ConflictError } from '~/utils/errors'
import { pickTrip } from '~/utils/formatter'
import { dayRangeUTC, toUTC } from '~/utils/timeTranfer'

/**
 * Lấy danh sách chuyến đi theo ngày hiện tại
 */
const getTrips = async (reqQuery) => {
  const { startLocation, endLocation, day, page, limit } = reqQuery
  const { startOfDay, endOfDay } = dayRangeUTC(new Date(day))
  const query = {
    startTime: { $gte: startOfDay, $lte: endOfDay },
    ...(startLocation ? { startLocation } : {}),
    ...(endLocation ? { endLocation } : {})
  }

  const trips = await tripRespository.findAllWithPagination(query, page, limit)
  return trips
}

/**
 * Lấy thông tin chuyến đi theo ID
 */
const getTripById = async (tripId) => {
  const trip = await tripRespository.findDetailTripById(tripId)
  if (!trip) {
    throw new ConflictError('Chuyến đi không tồn tại')
  }
  return trip
}

/**
 * Tạo mới chuyến đi
 */
const createTrip = async (tripData) => {
  // Bắt đầu phiên giao dịch (transaction)
  const session = await mongoose.startSession()
  session.startTransaction()

  try {
    const { startLocation, endLocation, startStation, endStation, startTime, endTime, price, carCompanyId, type } =
      tripData

    // kiểm tra xem chuyến đi đã tồn tại hay chưa
    const existedTrip = await tripRespository.checkExistingTrip(
      startLocation,
      endLocation,
      toUTC(startTime),
      toUTC(endTime),
      carCompanyId
    )
    if (existedTrip) {
      throw new ConflictError('Chuyến đi đã tồn tại')
    }

    // kiểm tra xem công ty xe có tồn tại hay không
    const carCompany = await carCompanyRepository.findById(carCompanyId)
    if (!carCompany) {
      throw new ConflictError('Công ty xe không tồn tại')
    }

    // tạo mới seat map
    const newSeatMap = await seatMapRepository.createSeatMap(
      {
        carCompanyId
      },
      { session }
    )

    // tạo mới chuyến đi
    const trip = await tripRespository.create(
      {
        startLocation,
        endLocation,
        startTime: toUTC(startTime),
        endTime: toUTC(endTime),
        price,
        startStation,
        endStation,
        carCompanyId,
        type,
        seatMapId: newSeatMap._id,
        totalSeats: carCompany.totalSeats
      },
      { session }
    )

    // Update the seat map with the trip ID
    await seatMapRepository.updateSeatMap(
      newSeatMap._id,
      {
        tripId: trip._id
      },
      { session }
    )

    await session.commitTransaction()
    session.endSession()

    return { carCompanyName: carCompany.name, ...pickTrip(trip) }
  } catch (error) {
    await session.abortTransaction()
    session.endSession()
    throw error
  }
}

/**
 * Cập nhật chuyến đi
 */
const updateTrip = async (tripId, tripData) => {
  const trip = await tripRespository.findById(tripId)
  if (!trip) {
    throw new ConflictError('Chuyến đi không tồn tại')
  }
  const updatedTrip = await tripRespository.updateById(tripId, tripData)
  return updatedTrip
}

/**
 * Xóa chuyến đi
 */
const deleteTrip = async (tripId) => {
  const trip = await tripRespository.findById(tripId)
  if (!trip) {
    throw new ConflictError('Chuyến đi không tồn tại')
  }
  await tripRespository.deleteById(tripId)
}

export const tripService = { createTrip, getTripById, getTrips, updateTrip, deleteTrip }
