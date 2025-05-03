import mongoose, { Schema } from 'mongoose'
import brcypt from 'bcrypt'
import { PHONE_NUMBER_RULE } from '~/utils/validators'

const USER_DOCUMENT_NAME = 'User'

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
      minLength: [8, 'Password must be at least 8 characters long']
    },
    fullName: {
      type: String,
      required: [true, 'Fullname is required'],
      trim: true,
      maxlength: [100, 'Full name cannot exceed 100 characters'],
      minLength: [2, 'Fullname must be at least 2 characters long']
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      unique: true,
      trim: true,
      match: [PHONE_NUMBER_RULE, 'Invalid phone number format']
    },
    // roleId: {
    //   type: Schema.Types.ObjectId,
    //   ref: 'UserRole',
    //   required: [true, 'Role ID is required']
    // },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: USER_DOCUMENT_NAME,
      default: null
    },
    bankAccountId: {
      type: Schema.Types.ObjectId,
      ref: 'BankAccount',
      default: null
    }
  },
  {
    timestamps: true
  }
)

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

export const userModel = mongoose.model(USER_DOCUMENT_NAME, userSchema)
