import { TICKET_STATUS, TITLE_TICKET_REQUESTS } from '~/constants'
import ticketRepository from '~/repositories/ticketRepository'
import tripRespository from '~/repositories/tripRepository'
import seatMapRepository from '~/repositories/seatMapRepository'
import { ConflictError, NotFoundError } from '~/utils/errors'
import { toUTC } from '~/utils/timeTranfer'
import mongoose from 'mongoose'
import { pickTrip } from '~/utils/formatter'

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
  const data = await ticketRepository.findTicketsWithPagination(filter, page, limit)
  if (!data || data.length === 0) {
    throw new NotFoundError('Không tìm thấy vé ')
  }
  data.results = data.results.map((ticket) => ({
    ...ticket,
    tripInfo: ticket.tripInfo ? pickTrip(ticket.tripInfo) : null
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

  if (
    updateData.status === TICKET_STATUS.CANCELLED &&
    !!updateData.seats &&
    updateData.titleRequest === TITLE_TICKET_REQUESTS.CANCEL_TICKET
  ) {
    // Bắt đầu transaction
    const session = await mongoose.startSession()
    session.startTransaction()
    try {
      // Lấy seatMap theo tripId
      const seatMap = await seatMapRepository.findByTripId(trip._id)
      if (!seatMap) throw new Error('Seat map không tồn tại cho chuyến đi này')
      const seatsToRemove = updateData.seats
      // Xoá ghế khỏi seatMap bằng $pull (so sánh đúng kiểu dữ liệu)
      await seatMapRepository.updateSeatMap(
        seatMap._id,
        {
          $pull: {
            seats: {
              $or: seatsToRemove.map((seat) => ({
                code: String(seat.code),
                floor: Number(seat.floor)
              }))
            }
          },
          $inc: { totalBookedSeats: -seatsToRemove.length }
        },
        { session }
      )
      // Tăng availableSeats của trip bằng $inc
      await tripRespository.updateTrip(trip._id, { $inc: { availableSeats: seatsToRemove.length } }, { session })
      // Cập nhật vé: loại bỏ các ghế đã huỷ khỏi ticket.seats (so sánh đúng kiểu dữ liệu)
      const newSeats = (ticketExists.seats || []).filter(
        (seat) =>
          !seatsToRemove.some(
            (removeSeat) =>
              String(seat.code) === String(removeSeat.code) && Number(seat.floor) === Number(removeSeat.floor)
          )
      )
      // Nếu vẫn còn ghế sau khi huỷ, chỉ cập nhật lại mảng seats và giữ nguyên status cũ
      // Nếu không còn ghế thì set status = CANCELLED
      const ticketUpdateData = {
        seats: newSeats
      }
      if (newSeats.length === 0) {
        ticketUpdateData.status = TICKET_STATUS.CANCELLED
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
