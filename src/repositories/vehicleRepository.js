import { vehicleModel } from '~/models/vehicleModel'

const findAll = async (filter = {}, page = 1, limit = 10, sortBy = { createdAt: -1 }) => {
  const skip = (page - 1) * limit

  const [results, total] = await Promise.all([
    vehicleModel
      .find(filter)
      .populate('companyId', 'name')
      .sort(sortBy)
      .skip(skip)
      .limit(limit)
      .lean(),
    vehicleModel.countDocuments(filter)
  ])

  return {
    results,
    pagination: {
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / limit)
    }
  }
}

const findById = async (vehicleId) => {
  return await vehicleModel.findById(vehicleId).populate('companyId', 'name description hotline').lean()
}

const findByLicensePlate = async (licensePlate) => {
  return await vehicleModel.findOne({ licensePlate: licensePlate.toUpperCase() }).lean()
}

const findByCompanyId = async (companyId, filter = {}) => {
  return await vehicleModel.find({ companyId, ...filter }).lean()
}

const create = async (vehicleData) => {
  const vehicle = new vehicleModel(vehicleData)
  return await vehicle.save()
}

const updateById = async (vehicleId, updateData) => {
  return await vehicleModel.findByIdAndUpdate(vehicleId, updateData, { new: true, runValidators: true }).lean()
}

const deleteById = async (vehicleId) => {
  return await vehicleModel.findByIdAndDelete(vehicleId).lean()
}

const findAvailable = async (companyId = null) => {
  const filter = { status: 'active' }
  if (companyId) {
    filter.companyId = companyId
  }
  return await vehicleModel.find(filter).populate('companyId', 'name').lean()
}

const countByCompany = async (companyId) => {
  return await vehicleModel.countDocuments({ companyId })
}

const countByStatus = async (companyId = null) => {
  const matchStage = companyId ? { companyId } : {}
  
  return await vehicleModel.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 }
      }
    }
  ])
}

export default {
  findAll,
  findById,
  findByLicensePlate,
  findByCompanyId,
  create,
  updateById,
  deleteById,
  findAvailable,
  countByCompany,
  countByStatus
} 