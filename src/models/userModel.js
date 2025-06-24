import brcypt from 'bcrypt'
import mongoose, { Schema } from 'mongoose'
import { DOCUMENT_NAMES, VALIDATION_RULES } from '~/constants'

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minLength: [
        VALIDATION_RULES.PASSWORD_MIN_LENGTH,
        `Password must be at least ${VALIDATION_RULES.PASSWORD_MIN_LENGTH} characters long`
      ]
    },
    fullName: {
      type: String,
      required: [true, 'Fullname is required'],
      trim: true,
      maxlength: [
        VALIDATION_RULES.FULLNAME_MAX_LENGTH,
        `Full name cannot exceed ${VALIDATION_RULES.FULLNAME_MAX_LENGTH} characters`
      ],
      minLength: [
        VALIDATION_RULES.FULLNAME_MIN_LENGTH,
        `Fullname must be at least ${VALIDATION_RULES.FULLNAME_MIN_LENGTH} characters long`
      ]
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      unique: true,
      trim: true,
      match: [VALIDATION_RULES.PHONE_NUMBER_RULE, 'Invalid phone number format']
    },
    roleId: {
      type: Schema.Types.ObjectId,
      ref: DOCUMENT_NAMES.USER_ROLE,
      required: [true, 'Role ID is required'],
      index: true // Index for aggregation grouping
    },
    /**
     * parentId: Lưu trữ ID của người dùng đã tạo ra người dùng này.
     * Phục vụ cho hệ thống phân cấp trong app:
     * - Admin có thể tạo tất cả các loại tài khoản
     * - Đại lý cấp 1 có thể tạo Đại lý cấp 2 và Người dùng
     * - Đại lý cấp 2 chỉ có thể tạo Người dùng
     * Thuộc tính này cho phép truy vết "ai tạo ra ai" và hỗ trợ chức năng quản lý user theo cấp bậc
     */
    parentId: {
      type: Schema.Types.ObjectId,
      ref: DOCUMENT_NAMES.USER,
      default: null,
      index: true // Index for hierarchy queries
    },
    bankAccountId: {
      type: Schema.Types.ObjectId,
      ref: DOCUMENT_NAMES.BANK_ACCOUNT,
      default: null
    },
    amount: {
      type: Number,
      default: 0,
      index: true // Index for amount aggregations
    }
  },
  {
    timestamps: true
  }
)

// Performance indexes for admin statistics
userSchema.index({ roleId: 1, createdAt: 1 }) // Compound index for role-based time queries
userSchema.index({ roleId: 1, amount: 1 }) // Compound index for role-based amount queries
userSchema.index({ createdAt: 1 }) // Index for time-based filtering

userSchema.pre('save', async function (next) {
  const user = this
  if (user.isModified('password')) {
    user.password = await brcypt.hash(user.password, 10)
  }
  next()
})

userSchema.methods.comparePassword = async function (userPassword) {
  return brcypt.compare(userPassword, this.password)
}

export const userModel = mongoose.model(DOCUMENT_NAMES.USER, userSchema)
