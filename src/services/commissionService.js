import commissionRepository from '~/repositories/commissionRepository'
import userRoleRepository from '~/repositories/userRoleRepository'
import { ConflictError, NotFoundError } from '~/utils/errors'

const updateCommission = async (roldeId, updateData) => {
  const role = await userRoleRepository.findById(roldeId)
  if (!role) {
    throw new NotFoundError('Không tìm thấy role')
  }

  const commission = await commissionRepository.findByRoleId(roldeId)
  if (!commission) {
    throw new NotFoundError('Không tìm thấy hoa hồng cho role này')
  }

  if (updateData < 0 || updateData > 100) {
    throw new ConflictError('Phần trăm hoa hồng phải nằm trong khoảng từ 0 đến 100')
  }

  const updatedCommission = await commissionRepository.updateCommission(commission.roleId, updateData)
  if (!updatedCommission) {
    throw new NotFoundError('Cập nhật hoa hồng không thành công')
  }
  const data = await commissionRepository.findCommissionById(updatedCommission._id)
  return data
}

const getAllCommissionsWithRoles = async () => {
  const data = await commissionRepository.getAllCommissionsWithRoles()
  return data
}

export const commissionService = {
  updateCommission,
  getAllCommissionsWithRoles
}
