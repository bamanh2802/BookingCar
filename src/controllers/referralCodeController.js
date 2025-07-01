import { StatusCodes } from 'http-status-codes'
import { referralCodeService } from '~/services/referralCodeService'
import ApiResponse from '~/utils/ApiResponse'
import { catchAsync } from '~/utils/catchAsync'

const generateReferralCode = catchAsync(async (req, res) => {
  const result = await referralCodeService.generateReferralCode(req.user, req.body)
  return res.status(StatusCodes.CREATED).json(ApiResponse.success(result, 'Referral code generated successfully'))
})

const useReferralCode = catchAsync(async (req, res) => {
  const result = await referralCodeService.useReferralCode(req.body.code, req.user._id)
  return res.status(StatusCodes.OK).json(ApiResponse.success(result, 'Referral code used successfully'))
})

const getReferralCodesByUserId = catchAsync(async (req, res) => {
  const userId = req.params.userId || req.user._id
  const result = await referralCodeService.getReferralCodesByUserId(userId)
  return res.status(StatusCodes.OK).json(ApiResponse.success(result, 'Referral codes retrieved successfully'))
})

const deactivateReferralCode = catchAsync(async (req, res) => {
  const result = await referralCodeService.deactivateReferralCode(req.body.code, req.user._id)
  return res.status(StatusCodes.OK).json(ApiResponse.success(result, 'Referral code deactivated successfully'))
})

export const referralCodeController = {
  generateReferralCode,
  useReferralCode,
  getReferralCodesByUserId,
  deactivateReferralCode
} 