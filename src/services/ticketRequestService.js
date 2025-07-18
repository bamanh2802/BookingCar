import ticketRequestRepository from '~/repositories/ticketRequestRepository'
import tripRespository from '~/repositories/tripRepository'
import { ConflictError, NotFoundError } from '~/utils/errors'
import { toUTC } from '~/utils/timeTranfer'
import mongoose from 'mongoose'
import carCompanyRepository from '~/repositories/carCompanyRepository'
import seatMapRepository from '~/repositories/seatMapRepository'
import { ticketService } from './ticketService'
import { REASON_REFUND, REFUND_STATUS, TICKET_STATUS, TITLE_TICKET_REQUESTS, USER_ROLES } from '~/constants'
import userRepository from '~/repositories/userRepository'
import { pickTrip, pickUser } from '~/utils/formatter'
import refundHistoryRepository from '~/repositories/refundHistoryRepository'
import bankAccountRepository from '~/repositories/bankAccountRepository'
import ticketRepository from '~/repositories/ticketRepository'
import { notifyAgentsAndAdminsOnTicketRequest } from './notificationService'
/**
 * Tạo yêu cầu vé mới
 */

const createTicketRequest = async (ticketRequest, currentUser) => {
  if (ticketRequest.titleRequest === TITLE_TICKET_REQUESTS.CANCEL_TICKET) {
    //Kiểm tra xem yêu cầu huỷ vé đã tồn tại chưa
    const existingCancelTicketRequest = await ticketRequestRepository.findOne({
      ticketId: ticketRequest.ticketId,
      titleRequest: TITLE_TICKET_REQUESTS.CANCEL_TICKET
    })
    if (existingCancelTicketRequest) {
      throw new ConflictError('Yêu cầu huỷ vé đã tồn tại cho chuyến đi này')
    }

    // Kiem tra xem vé có tồn tại không
    const ticket = await ticketRepository.findTicketById(ticketRequest.ticketId)
    if (!ticket) {
      throw new NotFoundError('Vé không tồn tại')
    }

    //Kiểm tra xem chỗ ngồi muốn huỷ có trùng với vé đã đặt không
    const existingSeats = ticket.seats.map((seat) => `${seat.code}_${seat.floor}`)
    const requestedSeats = ticketRequest.seats.map((seat) => `${seat.code}_${seat.floor}`)
    const duplicatedSeats = requestedSeats.filter((seat) => existingSeats.includes(seat))
    // Nếu không có ghế nào trùng, trả về lỗi
    if (duplicatedSeats.length === 0) {
      throw new ConflictError('Không có ghế nào trùng với vé đã đặt')
    }
    const newTicketRequestData = {
      ...ticketRequest,
      userId: ticket.userId,
      tripId: ticket.tripId,
      price: ticket.price,
      passengerName: ticket.passengerName,
      passengerPhone: ticket.passengerPhone,
      type: ticket.type,
      seats: ticketRequest.seats,
      status: TICKET_STATUS.PENDING
    }
    return await ticketRequestRepository.createTicketRequest(newTicketRequestData)
  }

  //Kiểm tra xem người dùng có tồn tại hay không
  const user = await userRepository.findById(ticketRequest.userId)
  if (!user) throw new ConflictError('Người dùng này không tồn tại')

  if (currentUser.roleName !== USER_ROLES.CLIENT && String(currentUser._id) !== String(user._id)) {
    ticketRequest.createdBy = currentUser._id
  }

  if (ticketRequest.titleRequest !== TITLE_TICKET_REQUESTS.REFUND) {
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
    // Tạo yêu cầu vé mới
    const newTicketRequest = await ticketRequestRepository.createTicketRequest(ticketRequest)
    await notifyAgentsAndAdminsOnTicketRequest(ticketRequest, currentUser)
    return newTicketRequest
  }

  // Tạo yêu cầu vé mới
  const newTicketRequest = await ticketRequestRepository.createTicketRequest(ticketRequest)
  await notifyAgentsAndAdminsOnTicketRequest(ticketRequest, currentUser)

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
  const { results, pagination } = await ticketRequestRepository.findTicketRequestsWithPagination(filter, page, limit)

  if (!results || results.length === 0) {
    throw new NotFoundError('Không tìm thấy yêu cầu vé ')
  }

  const mappedResults = results.map((item) => ({
    ...item,
    tripInfo: pickTrip(item.tripInfo),
    creatorInfo: item.creatorInfo ? pickUser(item.creatorInfo) : null
  }))
  return { results: mappedResults, pagination }
}

/**
 * Lấy danh sách yêu cầu vé theo ID người dùng
 * @param {string} userId - ID của người dùng
 */
const getTicketRequestsByUserId = async (userId, page = 1, limit = 10) => {
  const { results, pagination } = await ticketRequestRepository.findTicketRequestsByUserId(userId, page, limit)
  if (!results || results.length === 0) {
    throw new NotFoundError('Không tìm thấy yêu cầu vé cho người dùng này')
  }
  const mappedResults = results.map((item) => ({
    ...item,
    tripInfo: pickTrip(item.tripInfo)
  }))
  return { results: mappedResults, pagination }
}

/**
 * Lấy danh sách yêu cầu vé theo ID chuyến đi
 * @param {string} tripId - ID của chuyến đi
 */
const getTicketRequestsByTripId = async (tripId, page = 1, limit = 10) => {
  const { results, pagination } = await ticketRequestRepository.findTicketRequestsByTripId(tripId, page, limit)
  if (!results || results.length === 0) {
    throw new NotFoundError('Không tìm thấy yêu cầu vé cho chuyến đi này')
  }
  const mappedResults = results.map((item) => ({
    ...item,
    tripInfo: pickTrip(item.tripInfo)
  }))
  return { results: mappedResults, pagination }
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
  if (updateData.titleRequest === TITLE_TICKET_REQUESTS.BOOK_TICKET) {
    const session = await mongoose.startSession()
    session.startTransaction()
    try {
      // Kiểm tra thời gian hợp lệ trước khi update
      const trip = await tripRespository.findTripById(ticketRequest.tripId)
      if (!trip) throw new NotFoundError('Chuyến đi không tồn tại')
      const currentTime = new Date()
      if (toUTC(currentTime) > trip.startTime) {
        throw new ConflictError('Thời gian yêu cầu vé không hợp lệ, chuyến đi đã bắt đầu')
      }
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
        await ticketRequestRepository.deleteTicketRequest(ticketRequestId)
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
          price: trip.price,
          status: TICKET_STATUS.CONFIRMED,
          seats: requestedSeats,
          type: ticketRequest.type,
          createdBy: ticketRequest.createdBy || null,
          passengerName: ticketRequest.passengerName,
          passengerPhone: ticketRequest.passengerPhone,
          pickupStation: ticketRequest.pickupStation,
          dropoffStation: ticketRequest.dropoffStation
        },
        { session }
      )
      // Cập nhật thông tin yêu cầu vé
      const updatedTicketRequest = await ticketRequestRepository.updateTicketRequest(
        ticketRequestId,
        { ...updateData, status: TICKET_STATUS.CONFIRMED },
        {
          session
        }
      )

      //Cập nhật lại số ghế còn lại của chuyến đi
      await trip.updateAvailableSeats(requestedSeats.length)

      // //xoá request sau khi cập nhật
      // await ticketRequestRepository.deleteTicketRequest(ticketRequestId)

      // Lưu các thay đổi trong phiên giao dịch
      await session.commitTransaction()
      session.endSession()
      return updatedTicketRequest
    } catch (err) {
      await session.abortTransaction()
      session.endSession()
      throw err
    }
  } else if (updateData.titleRequest === TITLE_TICKET_REQUESTS.CANCEL_TICKET) {
    // Trường hợp huỷ vé

    //Kiểm tra xem vé có tồn tại không

    const ticket = await ticketService.getTicketById(ticketRequest.ticketId)
    // Kiểm tra thời gian hợp lệ trước khi update
    const trip = await tripRespository.findTripById(ticket.tripId)
    if (!trip) throw new NotFoundError('Chuyến đi không tồn tại')
    const currentTime = new Date()
    if (toUTC(currentTime) > trip.startTime) {
      throw new ConflictError('Thời gian yêu cầu vé không hợp lệ, chuyến đi đã bắt đầu')
    }

    if (ticket) {
      // Gọi updateTicket để xử lý huỷ vé và cập nhật seatMap, trip
      await ticketService.updateTicket(ticket._id, {
        seats: updateData.seats,
        titleRequest: TITLE_TICKET_REQUESTS.CANCEL_TICKET
      })
    }
    // Cập nhật trạng thái ticketRequest
    return await ticketRequestRepository.updateTicketRequest(ticketRequestId, {
      ...updateData,
      ticket,
      status: TICKET_STATUS.CANCELLED
    })
  } else if (updateData.titleRequest === TITLE_TICKET_REQUESTS.REFUND) {
    // Xử lý hoàn tiền thủ công
    // Không cần adminAction, chỉ cần truyền status mong muốn (REFUNDED hoặc 'Rejected')
    const ticketRequest = await ticketRequestRepository.findById(ticketRequestId)
    if (!ticketRequest) throw new NotFoundError('Yêu cầu vé không tồn tại')
    if (updateData.status === TICKET_STATUS.REFUNDED) {
      // Duyệt hoàn tiền
      const session = await mongoose.startSession()
      session.startTransaction()
      try {
        // Trừ tiền trong tài khoản người dùng
        const user = await userRepository.findById(ticketRequest.userId)
        if (!user) throw new NotFoundError('Người dùng không tồn tại')
        if (!user.bankAccountId) {
          throw new ConflictError('Người dùng không có tài khoản ngân hàng để hoàn tiền')
        }
        const bankAccount = await bankAccountRepository.findById(user.bankAccountId)
        if (!bankAccount.isVerified) {
          throw new ConflictError('Tài khoản ngân hàng chưa được xác minh')
        }
        user.amount -= ticketRequest.amount
        if (user.amount < 0) {
          throw new ConflictError('Số dư tài khoản không đủ để hoàn tiền')
        }

        await user.save({ session })
        // Lưu lịch sử hoàn tiền
        await refundHistoryRepository.createRefundHistory(
          {
            userId: user._id,
            amount: ticketRequest.amount,
            bankAccountId: user.bankAccountId,
            status: REFUND_STATUS.COMPLETED,
            reason: REASON_REFUND.USER_REQUEST
          },
          session
        )
        // Cập nhật trạng thái ticketRequest
        const updatedTicketRequest = await ticketRequestRepository.updateTicketRequest(
          ticketRequestId,
          {
            ...updateData,
            status: TICKET_STATUS.REFUNDED
          },
          { session }
        )
        await session.commitTransaction()
        session.endSession()
        return updatedTicketRequest
      } catch (err) {
        await session.abortTransaction()
        session.endSession()
        throw err
      }
    } else if (updateData.status === TICKET_STATUS.REJECTED) {
      // Từ chối hoàn tiền
      return await ticketRequestRepository.updateTicketRequest(ticketRequestId, {
        ...updateData,
        status: TICKET_STATUS.REJECTED
      })
    }
  } else {
    // Nếu không phải xác nhận, huỷ vé, chỉ update bình thường
    // Kiểm tra đã có vé chưa
    let updatedTicketRequest
    const ticket = await ticketService.getTicketByUserIdAndTripId(ticketRequest.userId, ticketRequest.tripId)
    if (ticket) {
      // Nếu có seats mới, kiểm tra số lượng và trùng ghế
      if (updateData.seats) {
        if (updateData.seats.length !== ticket.seats.length) {
          throw new ConflictError('Không được phép thay đổi số lượng ghế khi đã tạo vé')
        }
        // Bắt đầu transaction
        const session = await mongoose.startSession()
        session.startTransaction()
        try {
          // Lấy seatMap của trip
          const seatMap = await seatMapRepository.findByTripId(ticketRequest.tripId)
          if (!seatMap) throw new ConflictError('Seat map không tồn tại cho chuyến đi này')
          // Danh sách ghế đã đặt (trừ ghế cũ của vé này)
          const oldSeatsSet = new Set(ticket.seats.map((seat) => `${seat.code}_${seat.floor}`))
          const existedSeatSet = new Set(
            (seatMap.seats || [])
              .filter((seat) => !oldSeatsSet.has(`${seat.code}_${seat.floor}`))
              .map((seat) => `${seat.code}_${seat.floor}`)
          )
          // Kiểm tra trùng ghế
          const duplicated = updateData.seats.find((seat) => existedSeatSet.has(`${seat.code}_${seat.floor}`))
          if (duplicated) {
            throw new ConflictError(`Ghế đã tồn tại: code=${duplicated.code}, floor=${duplicated.floor}`)
          }
          // Cập nhật seatMap: xoá ghế cũ, thêm ghế mới
          await seatMapRepository.updateSeatMap(
            seatMap._id,
            {
              $pull: {
                seats: { $or: ticket.seats.map((seat) => ({ code: seat.code, floor: seat.floor })) }
              },
              $inc: { totalBookedSeats: -ticket.seats.length }
            },
            { session }
          )
          await seatMapRepository.updateSeatMap(
            seatMap._id,
            {
              $push: {
                seats: { $each: updateData.seats }
              },
              $inc: { totalBookedSeats: updateData.seats.length }
            },
            { session }
          )
          await ticketService.updateTicket(ticket._id, { seats: updateData.seats }, { session })
          // Cập nhật các thông tin cơ bản
          const ticketUpdateData = {}
          if (updateData.passengerName) ticketUpdateData.passengerName = updateData.passengerName
          if (updateData.passengerPhone) ticketUpdateData.passengerPhone = updateData.passengerPhone
          if (Object.keys(ticketUpdateData).length > 0) {
            await ticketService.updateTicket(ticket._id, ticketUpdateData, { session })
          }
          updatedTicketRequest = await ticketRequestRepository.updateTicketRequest(ticketRequestId, updateData, {
            session
          })
          await session.commitTransaction()
          session.endSession()
        } catch (err) {
          await session.abortTransaction()
          session.endSession()
          throw err
        }
      } else {
        // Không đổi ghế, chỉ cập nhật thông tin cơ bản
        const ticketUpdateData = {}
        if (updateData.passengerName) ticketUpdateData.passengerName = updateData.passengerName
        if (updateData.passengerPhone) ticketUpdateData.passengerPhone = updateData.passengerPhone
        if (Object.keys(ticketUpdateData).length > 0) {
          await ticketService.updateTicket(ticket._id, ticketUpdateData)
        }
        updatedTicketRequest = await ticketRequestRepository.updateTicketRequest(ticketRequestId, updateData)
      }
    } else {
      // Nếu không tìm thấy vé, chỉ update ticketRequest
      updatedTicketRequest = await ticketRequestRepository.updateTicketRequest(ticketRequestId, updateData)
    }
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
  getTicketRequestsByUserId,
  getTicketRequestsByTripId,
  getTicketRequestById,
  updateTicketRequest,
  deleteTicketRequest
}
