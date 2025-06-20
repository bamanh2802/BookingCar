import { updateCommissionSchema } from './schemas/commissionSchema'
import { validateRequest } from './validateRequest'

const updateCommission = validateRequest(updateCommissionSchema)

export const commissionValidation = {
  updateCommission
}
