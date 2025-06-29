import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import isoWeek from 'dayjs/plugin/isoWeek'
import advancedFormat from 'dayjs/plugin/advancedFormat'

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(isoWeek)
dayjs.extend(advancedFormat)

const TIMEZONE = 'Asia/Ho_Chi_Minh'

/**
 * Chuyển thời gian local (giờ Việt Nam) sang UTC để lưu vào DB
 * @param {string | Date} localDateTime
 * @returns {Date} UTC Date object
 */
export const toUTC = (localDateTime) => {
  return dayjs.tz(localDateTime, TIMEZONE).utc().toDate()
}

/**
 * Chuyển thời gian UTC từ DB về giờ Việt Nam để hiển thị
 * @param {Date} utcDateTime
 * @returns {string} ISO string theo giờ Việt Nam
 */
export const toLocalTime = (utcDateTime) => {
  return dayjs.utc(utcDateTime).tz(TIMEZONE).format('YYYY-MM-DD HH:mm:ss')
}

export const dayRangeUTC = (day) => {
  const startOfDay = dayjs.utc(day).startOf('day').toDate()
  const endOfDay = dayjs.utc(day).endOf('day').add(1, 'millisecond').toDate()

  return { startOfDay, endOfDay }
}
/**
 * Lấy tất cả thông tin cần thiết cho việc tạo báo cáo dựa trên một period cụ thể.
 * @param {string} period - ('7days', '1month', '12months').
 * @returns {{
 *   utcDateRange: {startDate: Date, endDate: Date},
 *   groupingInfo: {groupByFormat: string, labels: string[], timezone: string}
 * } | null}
 */
export const getReportTimeInfo = (period) => {
  if (!['7days', '1month', '12months'].includes(period)) {
    // Nếu period không hợp lệ hoặc không được cung cấp, trả về null hoặc một giá trị mặc định.
    // Ở đây ta trả về null để báo lỗi rõ ràng.
    return null
  }

  const nowInLocal = dayjs().tz(TIMEZONE)
  let startDateInLocal, endDateInLocal
  let labels = []
  let groupByFormat

  let current

  switch (period) {
    // ------------------- 7 NGÀY GẦN NHẤT, GOM THEO NGÀY -------------------
    case '7days':
      endDateInLocal = nowInLocal
      startDateInLocal = nowInLocal.subtract(6, 'day')
      groupByFormat = '%Y-%m-%d'

      current = startDateInLocal
      while (current.isBefore(endDateInLocal) || current.isSame(endDateInLocal, 'day')) {
        labels.push(current.format('YYYY-MM-DD'))
        current = current.add(1, 'day')
      }
      break

    // ------------------- 4 TUẦN GẦN NHẤT, GOM THEO TUẦN -------------------
    case '1month': // Logic này có nghĩa là "4 tuần gần nhất"
      // Lấy ngày cuối của tuần hiện tại làm mốc kết thúc
      endDateInLocal = nowInLocal.endOf('isoWeek')
      // Lùi lại 3 tuần và lấy ngày đầu của tuần đó làm mốc bắt đầu (tổng cộng 4 tuần)
      startDateInLocal = nowInLocal.subtract(3, 'week').startOf('isoWeek')
      groupByFormat = '%G-%V' // Định dạng cho MongoDB (Năm và Tuần ISO)

      current = startDateInLocal
      for (let i = 0; i < 4; i++) {
        // SỬA LỖI TẠI ĐÂY:
        // Phải gọi `current.format()` để tạo ra nhãn đúng, ví dụ: "2025-24"
        labels.push(current.format('GGGG-WW'))

        current = current.add(1, 'week')
      }
      break

    // ------------------- 12 THÁNG GẦN NHẤT, GOM THEO THÁNG -------------------
    case '12months': {
      endDateInLocal = nowInLocal
      // Lùi lại 11 tháng (tổng cộng 12 tháng)
      startDateInLocal = nowInLocal.subtract(11, 'month')
      groupByFormat = '%Y-%m'

      current = startDateInLocal.startOf('month')
      const endOfMonth = endDateInLocal.endOf('month')
      while (current.isBefore(endOfMonth) || current.isSame(endOfMonth, 'month')) {
        labels.push(current.format('YYYY-MM'))
        current = current.add(1, 'month')
      }
      break
    }
  }

  // Trả về một object chứa tất cả thông tin cần thiết
  return {
    utcDateRange: {
      startDate: startDateInLocal.startOf('day').utc().toDate(),
      endDate: endDateInLocal.endOf('day').utc().toDate()
    },
    groupingInfo: {
      groupByFormat,
      labels,
      timezone: TIMEZONE
    }
  }
}
