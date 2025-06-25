import { carCompanyService } from '~/services/carCompanyService'
import ApiResponse from '~/utils/ApiResponse'
import { catchAsync } from '~/utils/catchAsync'

/**
 * Lấy danh sách công ty xe khách (Admin)
 */
const getCompanies = catchAsync(async (req, res) => {
  const { page = 1, limit = 10, search, status } = req.query

  const filter = {}
  
  if (search) {
    filter.$or = [
      { companyName: { $regex: search, $options: 'i' } },
      { address: { $regex: search, $options: 'i' } },
      { phone: { $regex: search, $options: 'i' } }
    ]
  }

  if (status) {
    filter.status = status
  }

  const companies = await carCompanyService.getCarCompanies(filter, parseInt(page), parseInt(limit))
  return res.status(200).json(ApiResponse.success(companies, 'Lấy danh sách công ty xe khách thành công'))
})

/**
 * Tạo công ty xe khách mới (Admin)
 */
const createCompany = catchAsync(async (req, res) => {
  const createdCompany = await carCompanyService.createCarCompany(req.body)
  return res.status(201).json(ApiResponse.created(createdCompany, 'Tạo công ty xe khách thành công'))
})

/**
 * Cập nhật thông tin công ty xe khách (Admin)
 */
const updateCompany = catchAsync(async (req, res) => {
  const { companyId } = req.params
  const updatedCompany = await carCompanyService.updateCarCompany(companyId, req.body)
  return res.status(200).json(ApiResponse.success(updatedCompany, 'Cập nhật thông tin công ty xe khách thành công'))
})

/**
 * Lấy thông tin công ty xe khách theo ID (Admin)
 */
const getCompanyById = catchAsync(async (req, res) => {
  const { companyId } = req.params
  const company = await carCompanyService.getCarCompanyById(companyId)
  return res.status(200).json(ApiResponse.success(company, 'Lấy thông tin công ty xe khách thành công'))
})

/**
 * Xóa công ty xe khách (Admin)
 */
const deleteCompany = catchAsync(async (req, res) => {
  const { companyId } = req.params
  const result = await carCompanyService.deleteCarCompany(companyId)
  return res.status(200).json(ApiResponse.success(result, 'Xóa công ty xe khách thành công'))
})

/**
 * Kích hoạt/Vô hiệu hóa công ty xe khách (Admin)
 */
const toggleCompanyStatus = catchAsync(async (req, res) => {
  const { companyId } = req.params
  const { isActive } = req.body
  const updatedCompany = await carCompanyService.updateCarCompany(companyId, { isActive })
  return res.status(200).json(ApiResponse.success(updatedCompany, 'Cập nhật trạng thái công ty xe khách thành công'))
})

export const adminCompanyController = {
  getCompanies,
  createCompany,
  updateCompany,
  getCompanyById,
  deleteCompany,
  toggleCompanyStatus
} 