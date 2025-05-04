import { userRole } from "~/models/userRoleModel";
import BaseRepository from "./baseRepository";

/**
 * Repository xử lý tương tác với collection UserRole
 * @extends BaseRepository
 */
class UserRoleRepository extends BaseRepository {
  constructor() {
    super(userRole);
  }

  /**
   * Tìm vai trò theo tên
   * @param {String} roleName - Tên vai trò
   * @returns {Promise<Object>} UserRole document
   */
  async findByRoleName(roleName) {
    return this.findOne({ roleName });
  }

  /**
   * Cập nhật quyền cho vai trò
   * @param {String} roleId - ID của vai trò
   * @param {Array<String>} permissions - Danh sách quyền
   * @returns {Promise<Object>} Vai trò đã cập nhật
   */
  async updatePermissions(roleId, permissions) {
    return this.updateById(roleId, { permissions });
  }

  /**
   * Cập nhật vai trò kế thừa
   * @param {String} roleId - ID của vai trò
   * @param {Array<String>} inherits - Danh sách ID vai trò kế thừa
   * @returns {Promise<Object>} Vai trò đã cập nhật
   */
  async updateInherits(roleId, inherits) {
    return this.updateById(roleId, { inherits });
  }

  /**
   * Lấy tất cả vai trò với danh sách quyền của chúng
   * @returns {Promise<Array>} Danh sách vai trò
   */
  async findAllWithDetails() {
    return this.model.find().populate("inherits").lean();
  }

  /**
   * Kiểm tra vai trò có tồn tại không
   * @param {String} roleName - Tên vai trò
   * @returns {Promise<Boolean>} Kết quả kiểm tra
   */
  async checkRoleExists(roleName) {
    const count = await this.count({ roleName });
    return count > 0;
  }
}

// Singleton pattern
const userRoleRepository = new UserRoleRepository();
export default userRoleRepository;
