import { StatusCodes } from 'http-status-codes'
import { passwordResetService } from '~/services/passwordResetService'
import { catchAsync } from '~/utils/catchAsync'

const forgotPassword = catchAsync(async (req, res) => {
  const result = await passwordResetService.forgotPassword(req.body.email)
  res.status(StatusCodes.OK).json({
    message: result.message
  })
})

const resetPassword = catchAsync(async (req, res) => {
  const { email, otp, password } = req.body
  const result = await passwordResetService.resetPassword(email, otp, password)
  res.status(StatusCodes.OK).json({
    message: result.message
  })
})

export const passwordResetController = {
  forgotPassword,
  resetPassword
} 