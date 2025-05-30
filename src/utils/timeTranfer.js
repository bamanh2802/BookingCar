import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'

dayjs.extend(utc)
dayjs.extend(timezone)

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
  const startOfDay = dayjs(day).utc().startOf('day').toDate()

  const endOfDay = dayjs(day).utc().endOf('day').add(1, 'millisecond').toDate()

  return { startOfDay, endOfDay }
}
