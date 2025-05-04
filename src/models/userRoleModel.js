import mongoose, { Schema } from "mongoose";
import { DOCUMENT_NAMES, PERMISSIONS, USER_ROLES } from "~/constants";

const userRoleSchema = new Schema(
  {
    roleName: {
      type: String,
      required: true,
      trim: true,
      enum: [USER_ROLES.ADMIN, USER_ROLES.AGENT_LV1, USER_ROLES.AGENT_LV2, USER_ROLES.CLIENT],
      unique: true,
      default: USER_ROLES.CLIENT
    },
    inherits: {
      type: [Schema.Types.ObjectId],
      ref: DOCUMENT_NAMES.USER_ROLE,
      default: []
    },
    permissions: {
      type: [String],
      default: [],
      enum: Object.values(PERMISSIONS)
    }
  },
  { timestamps: true }
);

export const userRole = mongoose.model(DOCUMENT_NAMES.USER_ROLE, userRoleSchema);
