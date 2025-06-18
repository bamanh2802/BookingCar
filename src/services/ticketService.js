import ticketRepository from '~/repositories/ticketRepository'
import tripRespository from '~/repositories/tripRepository'
import { ConflictError } from '~/utils/errors'
import { toUTC } from '~/utils/timeTranfer'

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
  if (!ticket) {
    throw new Error('Không tìm thấy vé cho người dùng và chuyến đi này')
  }
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
