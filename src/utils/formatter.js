import { pick } from 'lodash'
import { toLocalTime } from './timeTranfer'
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'

export const pickUser = (user) => {
  if (!user) return {}
  return pick(user, ['_id', 'email', 'fullName', 'phone', 'roleId', 'parentId', 'createdAt', 'updatedAt'])
}

dayjs.extend(duration)

export const pickTrip = (trip) => {
  if (!trip) return {}

  // Lấy các trường cần thiết
  const {
    _id,
    startLocation,
    endLocation,
    startStation,
    endStation,
    startTime,
    endTime,
    price,
    carCompanyId,
    totalSeats,
    availableSeats
  } = pick(trip, [
    '_id',
    'startLocation',
    'endLocation',
    'startStation',
    'endStation',
    'startTime',
    'endTime',
    'price',
    'carCompanyId',
    'totalSeats',
    'availableSeats'
  ])

  // Tính thời lượng
  const diffMs = dayjs(endTime).diff(dayjs(startTime))
  const durationObj = dayjs.duration(diffMs)
  const time = `${durationObj.hours()}h${durationObj.minutes()}m`

  return {
    _id,
    startTime: toLocalTime(startTime),
    endTime: toLocalTime(endTime),
    price,
    location: `${startLocation} → ${endLocation}`,
    station: `${startStation} → ${endStation}`,
    time,
    totalSeats,
    availableSeats,
    carCompanyId
  }
}
