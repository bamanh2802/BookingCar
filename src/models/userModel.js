import brcypt from "bcrypt";
import mongoose, { Schema } from "mongoose";
import { DOCUMENT_NAMES, VALIDATION_RULES } from "~/constants";

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
      required: [true, "Password is required"],
      minLength: [
        VALIDATION_RULES.PASSWORD_MIN_LENGTH,
        `Password must be at least ${VALIDATION_RULES.PASSWORD_MIN_LENGTH} characters long`
      ]
    },
    fullName: {
      type: String,
      required: [true, "Fullname is required"],
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
      required: [true, "Phone number is required"],
      unique: true,
      trim: true,
      match: [VALIDATION_RULES.PHONE_NUMBER_RULE, "Invalid phone number format"]
    },
    // roleId: {
    //   type: Schema.Types.ObjectId,
    //   ref: 'UserRole',
    //   required: [true, 'Role ID is required']
    // },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: DOCUMENT_NAMES.USER,
      default: null
    },
    bankAccountId: {
      type: Schema.Types.ObjectId,
      ref: DOCUMENT_NAMES.BANK_ACCOUNT,
      default: null
    }
  },
  {
    timestamps: true
  }
);

userSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    user.password = await brcypt.hash(user.password, 10);
  }
  next();
});

userSchema.methods.comparePassword = async function (userPassword) {
  return brcypt.compare(userPassword, this.password);
};

export const userModel = mongoose.model(DOCUMENT_NAMES.USER, userSchema);
