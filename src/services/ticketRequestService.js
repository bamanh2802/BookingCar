import ticketRequestRepository from '~/repositories/ticketRequestRepository'
import tripRespository from '~/repositories/tripRepository'
import { ConflictError, NotFoundError } from '~/utils/errors'
import { toUTC } from '~/utils/timeTranfer'
import mongoose from 'mongoose'
import carCompanyRepository from '~/repositories/carCompanyRepository'
import seatMapRepository from '~/repositories/seatMapRepository'
import ticketService from './ticketService'
import { TICKET_STATUS, TITLE_TICKET_REQUESTS, USER_ROLES } from '~/constants'
import userRepository from '~/repositories/userRepository'
/**
 * Tạo yêu cầu vé mới
 */

const createTicketRequest = async (ticketRequest, currentUser) => {
  //Kiểm tra xem người dùng có tồn tại hay không
  const user = await userRepository.findById(ticketRequest.userId)
  if (!user) throw new ConflictError('Người dùng này không tồn tại')

  if (currentUser.roleName !== USER_ROLES.CLIENT && String(currentUser._id) !== String(user._id)) {
    ticketRequest.createdBy = currentUser._id
  }

  //Kiểm tra xem chuyến đi có tồn tại không
  const trip = await tripRespository.findTripById(ticketRequest.tripId)
  if (!trip) {
    throw new NotFoundError('Chuyến đi không tồn tại')
  }

  //Kiểm tra xem loại vé có hợp lệ không
  if (trip.type !== ticketRequest.type) {
    throw new ConflictError('Loại vé không hợp lệ cho chuyến đi này')
  }

  //Kiểm tra xem thời gian yêu cầu vé có hợp lệ không
  const currentTime = new Date()
  if (toUTC(currentTime) > trip.startTime) {
    throw new ConflictError('Thời gian yêu cầu vé không hợp lệ, chuyến đi đã bắt đầu')
  }

  // Kiểm tra xem yêu cầu vé đã tồn tại chưa
  const existingTicketRequest = await ticketRequestRepository.findTicketRequestByUserIdAndTripId(
    ticketRequest.userId,
    ticketRequest.tripId
  )
  if (existingTicketRequest) {
    throw new ConflictError('Yêu cầu vé đã tồn tại cho chuyến đi này')
  }

  // Tạo yêu cầu vé mới
  const newTicketRequest = await ticketRequestRepository.createTicketRequest(ticketRequest)
  return newTicketRequest
}

/**
 * Lấy danh sách yêu cầu vé với phân trang
 * @param {Object} filter - Bộ lọc để tìm kiếm yêu cầu vé
 * @param {number} page - Số trang hiện tại
 * @param {number} limit - Số lượng yêu cầu vé trên mỗi trang
 * @returns {Object} Danh sách yêu cầu vé và thông tin phân trang
 */
const getTicketRequests = async (filter = {}, page = 1, limit = 10) => {
  const result = await ticketRequestRepository.findTicketRequestsWithPagination(filter, page, limit)
  return result
}

/**
 * Lấy danh sách yêu cầu vé theo ID người dùng
 * @param {string} userId - ID của người dùng
 */
const getTicketRequestsByUserId = async (userId) => {
  // Kiểm tra xem người dùng có yêu cầu vé nào không
  const ticketRequests = await ticketRequestRepository.findTicketRequestsByUserId(userId)
  if (!ticketRequests || ticketRequests.length === 0) {
    throw new NotFoundError('Không tìm thấy yêu cầu vé cho người dùng này')
  }
  return ticketRequests
}

/**
 * Lấy danh sách yêu cầu vé theo ID chuyến đi
 * @param {string} tripId - ID của chuyến đi
 */
const getTicketRequestsByTripId = async (tripId) => {
  // Kiểm tra xem chuyến đi có yêu cầu vé nào không
  const ticketRequests = await ticketRequestRepository.findTicketRequestsByTripId(tripId)
  if (!ticketRequests || ticketRequests.length === 0) {
    throw new NotFoundError('Không tìm thấy yêu cầu vé cho chuyến đi này')
  }
  return ticketRequests
}

/**
 * Lấy thông tin yêu cầu vé theo ID
 * @param {string} ticketRequestId - ID của yêu cầu vé
 * @returns {Object} Thông tin yêu cầu vé
 */
const getTicketRequestById = async (ticketRequestId) => {
  const ticketRequest = await ticketRequestRepository.findTicketRequestById(ticketRequestId)
  if (!ticketRequest) {
    throw new NotFoundError('Yêu cầu vé không tồn tại')
  }
  return ticketRequest
}

/**
 * Cập nhật thông tin yêu cầu vé
 * @param {string} ticketRequestId - ID của yêu cầu vé
 * @param {Object} updateData - Dữ liệu cập nhật
 * @returns {Object} Thông tin yêu cầu vé đã cập nhật
 */

const updateTicketRequest = async (ticketRequestId, updateData) => {
  // Kiểm tra xem yêu cầu vé có tồn tại không
  const ticketRequest = await ticketRequestRepository.findTicketRequestById(ticketRequestId)
  if (!ticketRequest) {
    throw new NotFoundError('Yêu cầu vé không tồn tại')
  }

  // Nếu xác nhận, tạo mới vé và seatMap trong transaction
  if (updateData.status === TICKET_STATUS.CONFIRMED && updateData.titleRequest === TITLE_TICKET_REQUESTS.BOOK_TICKET) {
    const session = await mongoose.startSession()
    session.startTransaction()
    try {
      // Lấy thông tin chuyến đi
      const trip = await tripRespository.findTripById(ticketRequest.tripId)
      if (!trip) throw new NotFoundError('Chuyến đi không tồn tại')

      // Lấy thông tin hãng xe
      const carCompany = await carCompanyRepository.findOne({ _id: trip.carCompanyId })
      if (!carCompany) throw new NotFoundError('Hãng xe không tồn tại')

      // Cập nhật số lượng ghế đã đặt trong seatMap
      const seatMap = await seatMapRepository.findByTripId(ticketRequest.tripId)
      if (!seatMap) throw new NotFoundError('Seat map không tồn tại cho chuyến đi này')

      // Kiểm tra trùng ghế (tối ưu bằng Set)
      const requestedSeats = updateData.seats || ticketRequest.seats || []
      const existedSeatSet = new Set((seatMap.seats || []).map((seat) => `${seat.code}_${seat.floor}`))
      const duplicated = requestedSeats.find((seat) => existedSeatSet.has(`${seat.code}_${seat.floor}`))
      if (duplicated) {
        await ticketRequestRepository.deleteTicketRequest(ticketRequestId, { session })
        throw new ConflictError(`Ghế đã tồn tại: code=${duplicated.code}, floor=${duplicated.floor}`)
      }

      const updatedSeatMap = await seatMapRepository.updateSeatMap(
        seatMap._id,
        {
          $push: {
            seats: {
              $each: requestedSeats.map((seat) => ({
                code: seat.code,
                floor: seat.floor
              }))
            }
          },
          $inc: {
            totalBookedSeats: requestedSeats.length
          }
        },
        { session }
      )

      if (!updatedSeatMap) {
        throw new ConflictError('Cập nhật ghế không thành công')
      }

      // Tạo vé mới
      await ticketService.createTicket(
        {
          userId: ticketRequest.userId,
          tripId: ticketRequest.tripId,
          requestId: ticketRequest._id,
          status: TICKET_STATUS.CONFIRMED,
          seats: requestedSeats,
          type: ticketRequest.type,
          passengerName: ticketRequest.passengerName,
          passengerPhone: ticketRequest.passengerPhone
        },
        { session }
      )

      // Cập nhật thông tin yêu cầu vé
      const updatedTicketRequest = await ticketRequestRepository.updateTicketRequest(ticketRequestId, updateData, {
        session
      })

      //Cập nhật lại số ghế còn lại của chuyến đi
      await trip.updateAvailableSeats(requestedSeats.length)

      //xoá request sau khi cập nhật
      await ticketRequestRepository.deleteTicketRequest(ticketRequestId)

      // Lưu các thay đổi trong phiên giao dịch
      await session.commitTransaction()
      session.endSession()
      return updatedTicketRequest
    } catch (err) {
      await session.abortTransaction()
      session.endSession()
      throw err
    }
  } else {
    // Nếu không phải xác nhận, chỉ update bình thường
    const updatedTicketRequest = await ticketRequestRepository.updateTicketRequest(ticketRequestId, updateData)
    return updatedTicketRequest
  }
}
/**
 * Xóa yêu cầu vé theo ID
 * @param {string} ticketRequestId - ID của yêu cầu vé
 * @returns {Object} Kết quả xóa yêu cầu vé
 */
const deleteTicketRequest = async (ticketRequestId) => {
  // Kiểm tra xem yêu cầu vé có tồn tại không
  const ticketRequest = await ticketRequestRepository.findTicketRequestById(ticketRequestId)
  if (!ticketRequest) {
    throw new NotFoundError('Yêu cầu vé không tồn tại')
  }

  // Xóa yêu cầu vé
  await ticketRequestRepository.deleteTicketRequest(ticketRequestId)
  return {
    message: 'Xóa yêu cầu vé thành công'
  }
}
export const ticketRequestService = {
  createTicketRequest,
  getTicketRequests,
  getTicketRequestById,
  updateTicketRequest,
  deleteTicketRequest,
  getTicketRequestsByUserId,
  getTicketRequestsByTripId
}
