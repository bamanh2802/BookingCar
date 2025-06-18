import { TICKET_STATUS } from '~/constants'
import ticketRepository from '~/repositories/ticketRepository'
import tripRespository from '~/repositories/tripRepository'
import seatMapRepository from '~/repositories/seatMapRepository'
import { ConflictError } from '~/utils/errors'
import { toUTC } from '~/utils/timeTranfer'
import mongoose from 'mongoose'

/**
 * Tạo mới vé
 */
const createTicket = async (ticket) => {
  // Kiểm tra xem vé đã tồn tại cho chuyến đi này chưa
  const existingTicket = await ticketRepository.findTicketByUserIdAndTripId(ticket.userId, ticket.tripId)
  if (existingTicket) {
    throw new ConflictError('Vé đã tồn tại cho chuyến đi này')
  }

  // Tạo vé mới
  const newTicket = await ticketRepository.createTicket(ticket)
  return newTicket
}

/**
 * Lấy danh sách vé với phân trang
 */
const getTickets = async (filter = {}, page = 1, limit = 10) => {
  return ticketRepository.findTicketsWithPagination(filter, page, limit)
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

  if (updateData.status === TICKET_STATUS.CANCELLED && !!updateData.seats) {
    // Bắt đầu transaction
    const session = await mongoose.startSession()
    session.startTransaction()
    try {
      // Lấy seatMap theo tripId
      const seatMap = await seatMapRepository.findByTripId(trip._id)
      if (!seatMap) throw new Error('Seat map không tồn tại cho chuyến đi này')
      const seatsToRemove = updateData.seats
      // Xoá ghế khỏi seatMap bằng $pull
      await seatMapRepository.updateSeatMap(
        seatMap._id,
        {
          $pull: {
            seats: { $or: seatsToRemove.map((seat) => ({ code: seat.code, floor: seat.floor })) }
          },
          $inc: { totalBookedSeats: -seatsToRemove.length }
        },
        { session }
      )
      // Tăng availableSeats của trip bằng $inc
      await tripRespository.updateTrip(trip._id, { $inc: { availableSeats: seatsToRemove.length } }, { session })
      // Cập nhật vé sang trạng thái huỷ
      const updatedTicket = await ticketRepository.updateTicket(ticketId, updateData, { session })
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
  const tickets = await ticketRepository.findTicketsByUserId(userId)
  if (!tickets || tickets.length === 0) {
    throw new Error('Không tìm thấy vé cho người dùng này')
  }
  return tickets
}

/**
 * Lấy vé theo ID chuyến đi
 */
const getTicketsByTripId = async (tripId, page = 1, limit = 10) => {
  const tickets = await ticketRepository.findTicketsByTripIdWithPagination(tripId, page, limit)
  if (!tickets || tickets.results.length === 0) {
    throw new Error('Không tìm thấy vé cho chuyến đi này')
  }
  return tickets
}

/**
 * Lấy vé theo ID nguời dùng và ID chuyến đi
 */
const getTicketByUserIdAndTripId = async (userId, tripId) => {
  const ticket = await ticketRepository.findTicketByUserIdAndTripId(userId, tripId)
  return ticket
}

export default {
  createTicket,
  getTickets,
  getTicketById,
  updateTicket,
  deleteTicket,
  getTicketsByUserId,
  getTicketsByTripId,
  getTicketByUserIdAndTripId
}
