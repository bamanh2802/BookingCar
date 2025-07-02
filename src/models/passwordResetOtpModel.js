import mongoose from 'mongoose'
import bcrypt from 'bcrypt'

const passwordResetOtpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true
  },
  otp: {
    type: String,
    required: true
  },
  expiresAt: {
    type: Date,
    required: true
  }
}, {
  timestamps: true,
  collection: 'passwordResetOtps'
})

// Hash OTP before saving
passwordResetOtpSchema.pre('save', async function (next) {
  if (this.isModified('otp')) {
    const salt = await bcrypt.genSalt(10)
    this.otp = await bcrypt.hash(this.otp, salt)
  }
  next()
})

passwordResetOtpSchema.methods.compareOtp = async function (otp) {
  return bcrypt.compare(otp, this.otp)
}

export const PasswordResetOtp = mongoose.model('PasswordResetOtp', passwordResetOtpSchema) 