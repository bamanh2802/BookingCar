import { PasswordResetOtp } from '~/models/passwordResetOtpModel'

const storeOtp = async (email, otp, expiresAt) => {
  // Remove any existing OTP for this email to ensure only one is valid
  await PasswordResetOtp.deleteMany({ email })

  const newOtp = new PasswordResetOtp({
    email,
    otp,
    expiresAt
  })
  await newOtp.save()
  return newOtp
}

const findOtp = async (email, otp) => {
  const record = await PasswordResetOtp.findOne({ email, expiresAt: { $gt: new Date() } })
  if (!record) {
    return null
  }

  const isMatch = await record.compareOtp(otp)
  return isMatch ? record : null
}

const deleteOtp = async (email, otp) => {
  const record = await PasswordResetOtp.findOne({ email })
  if (record) {
    const isMatch = await record.compareOtp(otp)
    if (isMatch) {
        return await PasswordResetOtp.deleteOne({ _id: record._id })
    }
  }
  return null
}


export const passwordResetOtpRepository = {
  storeOtp,
  findOtp,
  deleteOtp
} 