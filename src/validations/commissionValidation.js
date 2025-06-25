import { commissionSchema, updateCommissionSchema } from './schemas/commissionSchema'
import { validateRequest } from './validateRequest'

const createCommission = validateRequest(commissionSchema)
const updateCommission = validateRequest(updateCommissionSchema)

export const commissionValidation = {
  createCommission,
  updateCommission
}
