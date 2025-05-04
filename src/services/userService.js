import userRepository from "~/repositories/userRepository";
import { ConflictError, NotFoundError } from "~/utils/errors";
import { pickUser } from "~/utils/formatter";

/**
 * Đăng ký người dùng mới
 * @param {Object} userData - Thông tin người dùng đăng ký
 * @returns {Object} Thông tin người dùng đã đăng ký
 */
const register = async (userData) => {
  // Kiểm tra người dùng đã tồn tại chưa
  const existedUser = await userRepository.checkExistingEmailOrPhone(
    userData.email,
    userData.phone
  );

  if (existedUser) {
    throw new ConflictError(
      "Phone number or email already exists!!",
      existedUser.email === userData.email ? "email" : "phone"
    );
  }

  // Tạo người dùng mới
  const user = await userRepository.create({
    email: userData.email,
    password: userData.password,
    fullName: userData.fullName,
    phone: userData.phone
  });

  return pickUser(user);
};

/**
 * Cập nhật thông tin người dùng
 * @param {string} userId - ID của người dùng
 * @param {Object} updateData - Dữ liệu cập nhật
 * @returns {Object} Thông tin người dùng đã cập nhật
 */
const updateUser = async (userId, updateData) => {
  const user = await userRepository.findById(userId);
  if (!user) {
    throw new NotFoundError("User not found");
  }

  // Không cho phép cập nhật email và phone qua API này
  delete updateData.email;
  delete updateData.phone;
  delete updateData.password;

  // Cập nhật thông tin người dùng
  const updatedUser = await userRepository.updateById(userId, updateData);
  return pickUser(updatedUser);
};

/**
 * Lấy thông tin người dùng theo ID
 * @param {string} userId - ID của người dùng
 * @returns {Object} Thông tin người dùng
 */
const getUserById = async (userId) => {
  const user = await userRepository.findById(userId);
  if (!user) {
    throw new NotFoundError("User not found");
  }
  return pickUser(user);
};

/**
 * Lấy danh sách người dùng với phân trang
 * @param {Object} filter - Điều kiện lọc
 * @param {Number} page - Trang hiện tại
 * @param {Number} limit - Số lượng items mỗi trang
 * @returns {Object} Kết quả phân trang
 */
const getUsers = async (filter = {}, page = 1, limit = 10) => {
  const result = await userRepository.findWithPagination(filter, page, limit);

  // Loại bỏ thông tin nhạy cảm
  result.results = result.results.map((user) => pickUser(user));

  return result;
};

export const userService = {
  register,
  updateUser,
  getUserById,
  getUsers
};
