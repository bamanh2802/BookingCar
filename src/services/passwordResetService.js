import { passwordResetOtpRepository } from '~/repositories/passwordResetOtpRepository'
import userRepository from '~/repositories/userRepository'
import { emailService } from './emailService'
import { generateOTP } from '~/utils/algorithms'
import { ApiError } from '~/utils/errors'
import bcrypt from 'bcrypt'

const forgotPassword = async (email) => {
  const user = await userRepository.findByEmail(email)
  if (!user) {
    throw new ApiError(404, 'User not found')
  }

  const otp = generateOTP()
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // OTP expires in 10 minutes

  await passwordResetOtpRepository.storeOtp(email, otp, expiresAt)

  const template = emailService.getEmailTemplate('passwordReset', { otp })
  await emailService.sendEmail(email, 'Yêu Cầu Đặt Lại Mật Khẩu', template)

  return { message: 'Password reset OTP has been sent to your email.' }
}

const resetPassword = async (email, otp, newPassword) => {
  const storedOtp = await passwordResetOtpRepository.findOtp(email, otp)

  if (!storedOtp || storedOtp.expiresAt < new Date()) {
    throw new ApiError(400, 'Invalid or expired OTP')
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10)
  await userRepository.updatePassword(email, hashedPassword)
  await passwordResetOtpRepository.deleteOtp(email, otp)

  return { message: 'Password has been reset successfully.' }
}

export const passwordResetService = {
  forgotPassword,
  resetPassword
} 