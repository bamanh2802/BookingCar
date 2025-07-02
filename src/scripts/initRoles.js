import mongoose from 'mongoose'
import { env } from '~/config/environment'
import { DEFAULT_ROLE_PERMISSIONS, USER_ROLES } from '~/constants'
import { userModel } from '~/models/userModel'
import { userRole } from '~/models/userRoleModel'
import { commissionModel } from '~/models/commissionModel'
import logger from '~/utils/logger'

// Tạo các vai trò mặc định
export const createDefaultRoles = async () => {
  try {
    const roles = {}

    // Tạo vai trò mặc định nếu chưa tồn tại, hoặc cập nhật permissions nếu đã tồn tại
    for (const roleName of Object.values(USER_ROLES)) {
      const existingRole = await userRole.findOne({ roleName })

      if (!existingRole) {
        const newRole = await userRole.create({
          roleName,
          permissions: DEFAULT_ROLE_PERMISSIONS[roleName] || []
        })
        roles[roleName] = newRole
        logger.info(`Created role: ${roleName}`)
      } else {
        // Cập nhật permissions cho role đã tồn tại
        const updatedPermissions = DEFAULT_ROLE_PERMISSIONS[roleName] || []

        // Kiểm tra xem có cần cập nhật permissions không
        const currentPermissions = existingRole.permissions || []
        const needsUpdate =
          updatedPermissions.length !== currentPermissions.length ||
          !updatedPermissions.every((permission) => currentPermissions.includes(permission))

        if (needsUpdate) {
          existingRole.permissions = updatedPermissions
          await existingRole.save()
          logger.info(`Updated permissions for role: ${roleName}`)
        } else {
          logger.info(`Role permissions already up to date: ${roleName}`)
        }

        roles[roleName] = existingRole
      }
    }

    return roles
  } catch (error) {
    logger.error('Error creating default roles', error)
    throw error
  }
}

// Tạo Admin mặc định nếu chưa tồn tại
export const createDefaultAdmin = async (adminRoleId) => {
  try {
    const existingAdmin = await userModel.findOne({
      email: env.DEFAULT_ADMIN_EMAIL
    })

    if (!existingAdmin) {
      // Tạo admin trực tiếp bằng model để tránh hash 2 lần
      const admin = new userModel({
        email: env.DEFAULT_ADMIN_EMAIL,
        password: env.DEFAULT_ADMIN_PASSWORD, // Để middleware pre-save tự hash
        fullName: 'Administrator',
        phone: env.DEFAULT_ADMIN_PHONE,
        roleId: adminRoleId
      })

      await admin.save()
      logger.info(`Created default admin: ${admin.email}`)
      return admin
    } else {
      logger.info(`Admin already exists: ${existingAdmin.email}`)
      return existingAdmin
    }
  } catch (error) {
    logger.error('Error creating default admin', error)
    throw error
  }
}

// Hàm khởi tạo commissionRates mặc định cho các role
export const createDefaultCommissionRates = async () => {
  try {
    const commissions = {}
    // Định nghĩa phần trăm hoa hồng mặc định cho từng role
    const defaultRates = {
      Admin: 0,
      AgentLv1: 5,
      AgentLv2: 5,
      Client: 3.5
    }

    for (const roleName of Object.values(USER_ROLES)) {
      const role = await userRole.findOne({ roleName })
      if (!role) {
        logger.warn(`Role not found: ${roleName}`)
        continue
      }
      const existingCommission = await commissionModel.findOne({ roleId: role._id })
      const defaultPercent = defaultRates[roleName] ?? 0
      if (!existingCommission) {
        const newCommission = await commissionModel.create({
          roleId: role._id,
          percent: defaultPercent
        })
        commissions[roleName] = newCommission
        logger.info(`Created default commission for role: ${roleName}`)
      } else {
        if (existingCommission.percent !== defaultPercent) {
          existingCommission.percent = defaultPercent
          await existingCommission.save()
          logger.info(`Updated commission percent for role: ${roleName}`)
        } else {
          logger.info(`Commission percent already up to date for role: ${roleName}`)
        }
        commissions[roleName] = existingCommission
      }
    }
    return commissions
  } catch (error) {
    logger.error('Error initializing commission rates', error)
    throw error
  }
}

// Hàm khởi tạo vai trò và admin mặc định
export const initializeRolesAndAdmin = async () => {
  try {
    // Tạo các vai trò mặc định
    const roles = await createDefaultRoles()

    // Tạo Admin mặc định
    if (roles[USER_ROLES.ADMIN]) {
      await createDefaultAdmin(roles[USER_ROLES.ADMIN]._id)
    }

    // Tạo commissionRates mặc định
    await createDefaultCommissionRates()

    logger.info('Roles, admin, and commission rates initialized successfully')
    return true
  } catch (error) {
    logger.error('Failed to initialize roles and admin:', error)
    return false
  }
}

// Chạy hàm khởi tạo khi script được gọi trực tiếp
if (require.main === module) {
  // Kết nối database
  mongoose
    .connect(env.MONGODB_URI)
    .then(async () => {
      logger.info('MongoDB connected.')

      try {
        await initializeRolesAndAdmin()
        logger.info('Initialization completed successfully')
      } catch (error) {
        logger.error('Initialization failed', error)
      } finally {
        // Đóng kết nối
        mongoose.connection.close()
        logger.info('MongoDB connection closed')
      }
    })
    .catch((error) => {
      logger.error('Could not connect to MongoDB', error)
      process.exit(1)
    })
}
