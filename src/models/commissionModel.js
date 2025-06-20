import mongoose, { Schema } from 'mongoose'
import { DOCUMENT_NAMES } from '~/constants'
const commissionSchema = new Schema(
  {
    roleId: { type: Schema.Types.ObjectId, ref: DOCUMENT_NAMES.USER_ROLE, required: true, unique: true },
    percent: { type: Number, required: true } // % hoa hồng
  },
  { timestamps: true }
)

export const commissionModel = mongoose.model(DOCUMENT_NAMES.COMMISSION, commissionSchema)
