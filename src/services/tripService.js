import mongoose from 'mongoose'
import { TICKET_STATUS, TRIP_TITLES } from '~/constants'
import carCompanyRepository from '~/repositories/carCompanyRepository'
import seatMapRepository from '~/repositories/seatMapRepository'
import ticketRepository from '~/repositories/ticketRepository'
import tripRespository from '~/repositories/tripRepository'
import { ConflictError } from '~/utils/errors'
import { pickTrip } from '~/utils/formatter'
import { dayRangeUTC, toUTC } from '~/utils/timeTranfer'
import { commissionService } from './commissionService'

/**
 * Lấy danh sách chuyến đi theo ngày hiện tại
 */
const getTrips = async (reqQuery = {}, page = 1, limit = 10) => {
  const { day, ...otherFilters } = reqQuery
  let filter = { ...otherFilters }
  console.log(reqQuery)

  if (day) {
    const { startOfDay, endOfDay } = dayRangeUTC(day)
    filter.startTime = { $gte: startOfDay, $lte: endOfDay }
  }
  const trips = await tripRespository.findAllTripWithPagination(filter, page, limit)
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
  const session = await mongoose.startSession()
  try {
    session.startTransaction()
    const trip = await tripRespository.findById(tripId)
    if (!trip) {
      throw new ConflictError('Chuyến đi không tồn tại')
    }
    if (trip.status && trip.status === TRIP_TITLES.COMPLETED) {
      throw new ConflictError('Không thể cập nhật chuyến đi đã hoàn thành')
    }

    if (tripData?.status && tripData.status === TRIP_TITLES.COMPLETED) {
      // BƯỚC 1: Tìm tất cả các vé cần xử lý TRƯỚC KHI cập nhật
      // Tìm các vé đã xác nhận và chưa được trả hoa hồng
      const ticketsToProcess = await ticketRepository.findTicketsByTripId(tripId, {
        status: TICKET_STATUS.CONFIRMED,
        commissionPaid: { $ne: true }
      })

      // Nếu có vé cần xử lý, mới thực hiện các bước tiếp theo
      if (ticketsToProcess.length > 0) {
        const ticketIdsToUpdate = ticketsToProcess.map((t) => t._id)

        // BƯỚC 2: Bulk update status tất cả vé thành DONE
        await ticketRepository.updateMany(
          { _id: { $in: ticketIdsToUpdate } }, // Cập nhật dựa trên ID đã tìm thấy
          { status: TICKET_STATUS.DONE },
          { session }
        )

        // BƯỚC 3: Trả hoa hồng cho từng vé đã tìm thấy ở BƯỚC 1
        for (const ticket of ticketsToProcess) {
          // ticket ở đây đã có đủ thông tin, không cần query lại
          await commissionService.payCommissionForTicket(ticket, session)
        }
      }
    }

    const updatedTrip = await tripRespository.updateById(tripId, { ...tripData }, { new: true, session })
    await session.commitTransaction()
    return updatedTrip
  } catch (error) {
    await session.abortTransaction()
    throw error
  } finally {
    session.endSession()
  }
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
