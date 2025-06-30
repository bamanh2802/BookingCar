import { TICKET_STATUS, TITLE_TICKET_REQUESTS } from '~/constants'
import ticketRepository from '~/repositories/ticketRepository'
import tripRespository from '~/repositories/tripRepository'
import seatMapRepository from '~/repositories/seatMapRepository'
import { ConflictError, NotFoundError } from '~/utils/errors'
import { toUTC } from '~/utils/timeTranfer'
import mongoose from 'mongoose'
import { pickTrip, pickUser } from '~/utils/formatter'

/**
 * Tạo mới vé
 */
const createTicket = async (ticket) => {
  // Tạo vé mới
  const newTicket = await ticketRepository.createTicket(ticket)
  return newTicket
}

/**
 * Lấy danh sách vé với phân trang
 */
const getTickets = async (filter = {}, page = 1, limit = 10) => {
  const data = await ticketRepository.findTicketsWithPagination(filter, page, limit)
  if (!data || data.length === 0) {
    throw new NotFoundError('Không tìm thấy vé ')
  }
  data.results = data.results.map((ticket) => ({
    ...ticket,
    tripInfo: ticket.tripInfo ? pickTrip(ticket.tripInfo) : null,
    creatorInfo: ticket.creatorInfo ? pickUser(ticket.creatorInfo) : null
  }))
  return data
}

/**
 * Lấy vé theo ID
 */
const getTicketById = async (ticketId) => {
  const ticket = await ticketRepository.getTicketDetail(ticketId)
  if (!ticket) {
    throw new Error('Vé không tồn tại')
  }
  return ticket
}

/**
 * Cập nhật vé
 */

const updateTicket = async (ticketId, updateData) => {
  // Kiểm tra xem vé có tồn tại không
  const ticketExists = await ticketRepository.findTicketById(ticketId)
  if (!ticketExists) {
    throw new Error('Vé không tồn tại')
  }

  const trip = await tripRespository.findTripById(ticketExists.tripId)
  const currentTime = new Date()
  if (toUTC(currentTime) > trip.startTime)
    throw new ConflictError('Thời gian yêu cầu vé không hợp lệ, chuyến đi đã bắt đầu')

  if (updateData.seats && updateData.titleRequest === TITLE_TICKET_REQUESTS.CANCEL_TICKET) {
    // Bắt đầu transaction
    const session = await mongoose.startSession()
    session.startTransaction()
    try {
      // Lấy seatMap theo tripId
      const seatMap = await seatMapRepository.findByTripId(trip._id)
      if (!seatMap) throw new Error('Seat map không tồn tại cho chuyến đi này')
      const ticketSeats = ticketExists.seats || []
      const updateSeats = updateData.seats || []
      // Chuẩn hoá kiểu dữ liệu
      const normalizedUpdateSeats = updateSeats.map((seat) => ({
        code: String(seat.code),
        floor: Number(seat.floor)
      }))
      const normalizedTicketSeats = ticketSeats.map((seat) => ({
        code: String(seat.code),
        floor: Number(seat.floor)
      }))
      // So sánh hai mảng seats

      const isFullCancel =
        normalizedUpdateSeats.length === normalizedTicketSeats.length &&
        normalizedUpdateSeats.every((s1) =>
          normalizedTicketSeats.some((s2) => s1.code === s2.code && s1.floor === s2.floor)
        ) &&
        normalizedTicketSeats.every((s1) =>
          normalizedUpdateSeats.some((s2) => s1.code === s2.code && s1.floor === s2.floor)
        )

      let ticketUpdateData = {}
      if (isFullCancel) {
        // Huỷ toàn bộ vé: giữ nguyên ticketExists.seats, chỉ đổi status = CANCELLED
        await seatMapRepository.updateSeatMap(
          seatMap._id,
          {
            $pull: {
              seats: {
                $or: normalizedUpdateSeats
              }
            },
            $inc: { totalBookedSeats: -normalizedUpdateSeats.length }
          },
          { session }
        )
        await tripRespository.updateTrip(
          trip._id,
          { $inc: { availableSeats: normalizedUpdateSeats.length } },
          { session }
        )
        ticketUpdateData = { status: TICKET_STATUS.CANCELLED }
      } else {
        // Huỷ một phần ghế
        await seatMapRepository.updateSeatMap(
          seatMap._id,
          {
            $pull: {
              seats: {
                $or: normalizedUpdateSeats
              }
            },
            $inc: { totalBookedSeats: -normalizedUpdateSeats.length }
          },
          { session }
        )
        await tripRespository.updateTrip(
          trip._id,
          { $inc: { availableSeats: normalizedUpdateSeats.length } },
          { session }
        )
        // Loại bỏ các ghế đã huỷ khỏi ticket.seats
        const newSeats = normalizedTicketSeats.filter(
          (seat) =>
            !normalizedUpdateSeats.some(
              (removeSeat) => seat.code === removeSeat.code && seat.floor === removeSeat.floor
            )
        )
        ticketUpdateData = { seats: newSeats, status: TICKET_STATUS.CONFIRMED }
      }
      const updatedTicket = await ticketRepository.updateTicket(ticketId, ticketUpdateData, { session })
      if (!updatedTicket) {
        throw new Error('Cập nhật vé không thành công')
      }
      await session.commitTransaction()
      session.endSession()
      return updatedTicket
    } catch (err) {
      await session.abortTransaction()
      session.endSession()
      throw err
    }
  }
  // Cập nhật vé
  const updatedTicket = await ticketRepository.updateTicket(ticketId, updateData)
  if (!updatedTicket) {
    throw new Error('Cập nhật vé không thành công')
  }
  return updatedTicket
}

/**
 * Xóa vé
 */
const deleteTicket = async (ticketId) => {
  // Kiểm tra xem vé có tồn tại không
  const ticketExists = await ticketRepository.exists(ticketId)
  if (!ticketExists) {
    throw new Error('Vé không tồn tại')
  }
  const deletedTicket = await ticketRepository.deleteTicket(ticketId)
  if (!deletedTicket) {
    throw new Error('Xóa vé không thành công')
  }
  return deletedTicket
}

/**
 * Lấy vé theo ID người dùng
 */
const getTicketsByUserId = async (userId) => {
  const data = await ticketRepository.findTicketsByUserIdWithPagination(userId)
  if (!data || data.length === 0) {
    throw new NotFoundError('Không tìm thấy vé cho người dùng này')
  }

  data.results = data.results.map((ticket) => ({
    ...ticket,
    tripInfo: ticket.tripInfo ? pickTrip(ticket.tripInfo) : null
  }))

  return data
}

/**
 * Lấy vé theo ID chuyến đi
 */
const getTicketsByTripId = async (tripId, page = 1, limit = 10) => {
  const data = await ticketRepository.findTicketsByTripIdWithPagination(tripId, page, limit)
  if (!data || data.length === 0) {
    throw new NotFoundError('Không tìm thấy vé cho chuyến đi này')
  }
  data.results = data.results.map((ticket) => ({
    ...ticket,
    tripInfo: ticket.tripInfo ? pickTrip(ticket.tripInfo) : null
  }))
  return data
}

/**
 * Lấy vé theo ID nguời dùng và ID chuyến đi
 */
const getTicketByUserIdAndTripId = async (userId, tripId) => {
  const ticket = await ticketRepository.findTicketByUserIdAndTripId(userId, tripId)
  return ticket
}

export const ticketService = {
  createTicket,
  getTickets,
  getTicketById,
  updateTicket,
  deleteTicket,
  getTicketsByUserId,
  getTicketsByTripId,
  getTicketByUserIdAndTripId
}
