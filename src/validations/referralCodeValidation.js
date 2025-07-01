import {
  generateReferralCodeSchema,
  useReferralCodeSchema,
  deactivateReferralCodeSchema
} from './schemas/referralCodeSchema'
import { validateRequest } from './validateRequest'

const generateReferralCode = validateRequest(generateReferralCodeSchema)
const useReferralCode = validateRequest(useReferralCodeSchema)
const deactivateReferralCode = validateRequest(deactivateReferralCodeSchema)

export const referralCodeValidation = {
  generateReferralCode,
  useReferralCode,
  deactivateReferralCode
} 