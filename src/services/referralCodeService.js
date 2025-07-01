import crypto from 'crypto'
import { referralCodeRepository } from '~/repositories/referralCodeRepository'
import userRepository from '~/repositories/userRepository'
import { ConflictError, ForbiddenError, NotFoundError } from '~/utils/errors'
import { USER_ROLES } from '~/constants'

class ReferralCodeService {
  async generateReferralCode(currentUser, body) {
    const { userId, code: customCode } = body

    const targetUserId = userId || currentUser._id
    const user = await userRepository.findById(targetUserId)
    if (!user) {
      throw new NotFoundError('Target user not found')
    }

    let finalCode = customCode

    if (finalCode) {
      // If a custom code is provided, check if it already exists
      const existingCode = await referralCodeRepository.findByCode(finalCode)
      if (existingCode) {
        throw new ConflictError('This referral code is already taken. Please choose another one.')
      }
    } else {
      // If no custom code, generate a random one and ensure it's unique
      let isUnique = false
      while (!isUnique) {
        finalCode = crypto.randomBytes(4).toString('hex').toUpperCase()
        const existingCode = await referralCodeRepository.findByCode(finalCode)
        if (!existingCode) {
          isUnique = true
        }
      }
    }

    // Create new referral code
    return referralCodeRepository.createReferralCode({
      code: finalCode,
      userId: targetUserId,
      createdBy: currentUser._id
    })
  }

  async useReferralCode(code, userId) {
    // Find active referral code
    const referralCode = await referralCodeRepository.findByCode(code)
    if (!referralCode) {
      throw new NotFoundError('Invalid or inactive referral code')
    }

    // A user cannot use their own referral code
    if (referralCode.userId.toString() === userId.toString()) {
      throw new ConflictError('You cannot use your own referral code.')
    }

    // Check if user exists
    const user = await userRepository.findById(userId)
    if (!user) {
      throw new NotFoundError('User not found')
    }

    // Check if user already has a parent
    if (user.parentId) {
      throw new ConflictError('User already has a parent')
    }

    // Update user's parentId
    await userRepository.updateById(userId, {
      parentId: referralCode.userId
    })

    return { success: true }
  }

  async getReferralCodesByUserId(userId) {
    return referralCodeRepository.findByUserId(userId)
  }

  async deactivateReferralCode(code, userId) {
    const referralCode = await referralCodeRepository.findByCode(code)
    if (!referralCode) {
      throw new NotFoundError('Referral code not found')
    }

    if (referralCode.userId.toString() !== userId) {
      throw new ConflictError('You can only deactivate your own referral codes')
    }

    return referralCodeRepository.deactivateCode(code)
  }
}

export const referralCodeService = new ReferralCodeService() 