import mongoose, { Schema } from 'mongoose'
import { USER_ROLES } from '~/utils/constants'
const USER_ROLES_DOCUMENT_NAME = 'UserRole'

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
      ref: USER_ROLES_DOCUMENT_NAME,
      default: []
    },
    permissions: {
      type: [String],
      default: [],
      enum: [
        'manage_users',
        'manage_routes',
        'manage_tickets',
        'manage_refunds',
        'manage_reviews',
        'manage_reports',
        'view_tickets_users',
        'view_reports_users',
        'view_tickets_agents_lv2',
        'view_reports_agents_lv2',
        'manage_agents_lv2',
        'book_tickets',
        'view_history',
        'submit_reviews',
        'request_refunds'
      ]
    }
  },
  { timestamps: true }
)

export const userRole = mongoose.model(USER_ROLES_DOCUMENT_NAME, userRoleSchema)
