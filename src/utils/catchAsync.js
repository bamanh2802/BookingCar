/**
 * Utility function để bọc async controller function và xử lý lỗi một cách nhất quán
 * @param {Function} fn - Async controller function cần bọc
 * @returns {Function} Express middleware function
 */
export const catchAsync = (fn) => {
  return (req, res, next) => {
    // Gọi async function và bắt lỗi nếu có, chuyển đến middleware xử lý lỗi
    fn(req, res, next).catch(next)
  }
}
