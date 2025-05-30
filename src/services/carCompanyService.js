import carCompanyRepository from '../repositories/carCompanyRepository.js'
import { ConflictError, NotFoundError } from '../utils/errors/index.js'
/**
 * tao moi hang xe
 */

const createCarCompany = async (carCompany) => {
  // Kiểm tra xem công ty xe đã tồn tại chưa
  const existingCarCompany = await carCompanyRepository.existsByNameOrHotline(carCompany.name, carCompany.hotline)
  if (existingCarCompany) {
    throw new ConflictError('Nhà xe đã tồn tại với tên hoặc số điện thoại này')
  }

  // Tạo công ty xe mới
  const newCarCompany = await carCompanyRepository.create(carCompany)
  return newCarCompany
}

/**
 * Lấy danh sách công ty xe với phân trang
 * @param {Object} filter - Bộ lọc để tìm kiếm công ty xe
 * @param {number} page - Số trang hiện tại
 * @param {number} limit - Số lượng công ty xe trên mỗi trang
 * @returns {Object} Danh sách công ty xe và thông tin phân trang
 */
const getCarCompanies = async (filter = {}, page = 1, limit = 10) => {
  const result = await carCompanyRepository.findWithPagination(filter, page, limit)
  return result
}

/**
 * Lấy thông tin công ty xe theo ID
 * @param {string} carCompanyId - ID của công ty xe
 * @returns {Object} Thông tin công ty xe
 */
const getCarCompanyById = async (carCompanyId) => {
  const carCompany = await carCompanyRepository.findById(carCompanyId)
  if (!carCompany) {
    throw new NotFoundError('Car company not found')
  }
  return carCompany
}

/**
 * Cập nhật thông tin công ty xe
 * @param {string} carCompanyId - ID của công ty xe
 * @param {Object} updateData - Dữ liệu cập nhật
 * @returns {Object} Thông tin công ty xe đã cập nhật
 */
const updateCarCompany = async (carCompanyId, updateData) => {
  // Kiểm tra xem công ty xe có tồn tại không
  const carCompany = await carCompanyRepository.findById(carCompanyId)
  if (!carCompany) {
    throw new NotFoundError('Car company not found')
  }

  delete updateData.totalSeats // Không cho phép cập nhật tổng số ghế từ bên ngoài

  // Cập nhật thông tin công ty xe
  const updatedCarCompany = await carCompanyRepository.updateById(carCompanyId, updateData)
  return updatedCarCompany
}

/**
 * Xóa công ty xe theo ID
 * @param {string} carCompanyId - ID của công ty xe
 * @returns {Object} Kết quả xóa công ty xe
 */
const deleteCarCompany = async (carCompanyId) => {
  // Kiểm tra xem công ty xe có tồn tại không
  const carCompany = await carCompanyRepository.findById(carCompanyId)
  if (!carCompany) {
    throw new NotFoundError('Car company not found')
  }

  // Xóa công ty xe
  const deletedCarCompany = await carCompanyRepository.deleteById(carCompanyId)
  return deletedCarCompany
}

export const carCompanyService = {
  createCarCompany,
  getCarCompanies,
  getCarCompanyById,
  updateCarCompany,
  deleteCarCompany
}
