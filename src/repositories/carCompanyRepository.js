import BaseRepository from './baseRepository.js'
import { carCompanyModel } from '~/models/carCompanyModel.js'

class CarCompanyRepository extends BaseRepository {
  constructor() {
    super(carCompanyModel)
  }

  // Tìm kiếm công ty xe theo tên hoặc số điện thoại
  async findByNameOrHotline(nameOrHotline) {
    return this.findOne({
      $or: [{ name: nameOrHotline }, { hotline: nameOrHotline }]
    })
  }
  //kiem tra ton tai theo ten hoac so dien thoai
  async existsByNameOrHotline(name, hotline) {
    return this.exists({
      $or: [{ name: name }, { hotline: hotline }]
    })
  }
  //tim hang xe va phan trang
  async findWithPagination(filter = {}, page = 1, limit = 10, sort = { createdAt: -1 }) {
    const skip = (page - 1) * limit

    const [results, total] = await Promise.all([this.findAll(filter, '', { skip, limit, sort }), this.count(filter)])

    return {
      results,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    }
  }
}

//Singleton instance of CarCompanyRepository
const carCompanyRepository = new CarCompanyRepository()
export default carCompanyRepository
