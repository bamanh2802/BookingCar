import { carCompanySchema, carCompanyUpdateSchema } from './schemas/carCompanySchema'
import { validateRequest } from './validateRequest'
/**
 * Middklleware validation cho carCompany
 */
const createCarCompany = validateRequest(carCompanySchema)
const updateCarCompany = validateRequest(carCompanyUpdateSchema)

export const carCompanyValidation = {
  createCarCompany,
  updateCarCompany
}
