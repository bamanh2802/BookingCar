import express from 'express'
import { referralCodeController } from '~/controllers/referralCodeController'
import { USER_ROLES } from '~/constants'
import { authMiddleware } from '~/middlewares/authMiddleware'
import { referralCodeValidation } from '~/validations/referralCodeValidation'

const router = express.Router()

// Authenticated client routes
router.use(authMiddleware.authenticate)

router.post('/use', referralCodeValidation.useReferralCode, referralCodeController.useReferralCode)

// Admin and Agent routes
router.post(
  '/generate',
  authMiddleware.restrictTo(USER_ROLES.ADMIN, USER_ROLES.AGENT_LV1, USER_ROLES.AGENT_LV2),
  referralCodeValidation.generateReferralCode,
  referralCodeController.generateReferralCode
)

router.patch(
  '/deactivate',
  authMiddleware.restrictTo(USER_ROLES.ADMIN, USER_ROLES.AGENT_LV1, USER_ROLES.AGENT_LV2),
  referralCodeValidation.deactivateReferralCode,
  referralCodeController.deactivateReferralCode
)

router.get('/my-codes',
  authMiddleware.restrictTo(USER_ROLES.ADMIN, USER_ROLES.AGENT_LV1, USER_ROLES.AGENT_LV2),
  referralCodeController.getReferralCodesByUserId
)

router.get(
  '/:userId',
  authMiddleware.restrictTo(USER_ROLES.ADMIN, USER_ROLES.AGENT_LV1, USER_ROLES.AGENT_LV2),
  referralCodeController.getReferralCodesByUserId
)

export const referralCodeRoutes = router