/**
 * Hàm helper để điền vào các khoảng trống trong dữ liệu biểu đồ
 */
export const fillMissingChartData = (dbData, allLabels) => {
  const dataMap = new Map(dbData.map((item) => [item._id, item]))
  return allLabels.map((label) => {
    if (dataMap.has(label)) {
      const { _id, ...rest } = dataMap.get(label)
      return { label, ...rest }
    }
    return { label, totalRevenue: 0, totalTickets: 0 }
  })
}

/**
 * Generate a random 6-digit OTP
 * @returns {string}
 */
export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString()
}
