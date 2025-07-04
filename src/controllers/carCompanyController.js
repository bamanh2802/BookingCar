import { StatusCodes } from 'http-status-codes'
import { carCompanyService } from '../services/carCompanyService.js'
import ApiResponse from '../utils/ApiResponse.js'
import { catchAsync } from '../utils/catchAsync.js'

/*
 * Tao công ty xe mới
 */
const createCarCompany = catchAsync(async (req, res) => {
  const carCompany = await carCompanyService.createCarCompany(req.body)
  return res.status(StatusCodes.CREATED).json(ApiResponse.created(carCompany, 'Tạo công ty xe thành công'))
})

/**
 * Lấy danh sách công ty xe
 */
const getCarCompanies = catchAsync(async (req, res) => {
  const { page, limit } = req.query
  const filter = req.query.filter || {}
  const carCompanies = await carCompanyService.getCarCompanies(filter, parseInt(page), parseInt(limit))
  return res.status(StatusCodes.OK).json(ApiResponse.success(carCompanies, 'Lấy danh sách công ty xe thành công'))
})

/**
 * Lấy thông tin công ty xe theo ID
 */
const getCarCompanyById = catchAsync(async (req, res) => {
  const { carCompanyId } = req.params
  const carCompany = await carCompanyService.getCarCompanyById(carCompanyId)
  return res.status(StatusCodes.OK).json(ApiResponse.success(carCompany, 'Lấy thông tin công ty xe thành công'))
})

/**
 * Cập nhật thông tin công ty xe
 */
const updateCarCompany = catchAsync(async (req, res) => {
  const { carCompanyId } = req.params
  const updatedCarCompany = await carCompanyService.updateCarCompany(carCompanyId, req.body)
  return res
    .status(StatusCodes.OK)
    .json(ApiResponse.success(updatedCarCompany, 'Cập nhật thông tin công ty xe thành công'))
})

/**
 * Xóa công ty xe theo ID
 */
const deleteCarCompany = catchAsync(async (req, res) => {
  const { carCompanyId } = req.params
  await carCompanyService.deleteCarCompany(carCompanyId)
  return res.status(StatusCodes.OK).json(
    ApiResponse.success({
      message: 'Xóa công ty xe thành công'
    })
  )
})

export const carCompanyController = {
  createCarCompany,
  getCarCompanies,
  getCarCompanyById,
  updateCarCompany,
  deleteCarCompany
}
