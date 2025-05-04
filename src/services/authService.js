import { env } from "~/config/environment";
import { jwtProvider } from "~/providers/jwtProvider";
import userRepository from "~/repositories/userRepository";
import userRoleRepository from "~/repositories/userRoleRepository";
import { AuthenticationError, NotFoundError } from "~/utils/errors";
import { pickUser } from "~/utils/formatter";

/**
 * Xác thực người dùng với email/phone và password
 * @param {Object} credentials - Thông tin đăng nhập
 * @returns {Object} User info và tokens
 */
const login = async (credentials) => {
  // Tìm người dùng theo email hoặc số điện thoại
  const emailOrPhone = credentials.email || credentials.phone;
  const user = await userRepository.findByEmailOrPhone(emailOrPhone);

  if (!user) {
    throw new NotFoundError("Email or Phone number not found!");
  }

  // Kiểm tra mật khẩu
  const isMatchPassword = await user.comparePassword(credentials.password);
  if (!isMatchPassword) {
    throw new AuthenticationError("Wrong password!");
  }

  // Lấy thông tin vai trò
  const userRole = user.roleId
    ? await userRoleRepository.findById(user.roleId)
    : null;

  // Tạo thông tin người dùng cho token
  const userInfo = {
    _id: user._id,
    email: user.email,
    phone: user.phone,
    roleId: user.roleId,
    roleName: userRole ? userRole.roleName : null,
  };

  // Tạo access token và refresh token
  const accessToken = await generateAccessToken(userInfo);
  const refreshToken = await generateRefreshToken(userInfo);

  return {
    accessToken,
    refreshToken,
    ...pickUser(user),
    roleName: userRole ? userRole.roleName : null,
  };
};

/**
 * Tạo access token mới
 * @param {Object} userInfo - Thông tin người dùng
 * @returns {string} JWT access token
 */
const generateAccessToken = (userInfo) => {
  return jwtProvider.generateToken(
    userInfo,
    env.ACCESS_TOKEN_SECRET_KEY,
    env.ACCESS_TOKEN_LIFE
  );
};

/**
 * Tạo refresh token mới
 * @param {Object} userInfo - Thông tin người dùng
 * @returns {string} JWT refresh token
 */
const generateRefreshToken = (userInfo) => {
  return jwtProvider.generateToken(
    userInfo,
    env.REFRESH_TOKEN_SECRET_KEY,
    env.REFRESH_TOKEN_LIFE
  );
};

/**
 * Tạo token mới từ refresh token
 * @param {string} refreshToken - Refresh token
 * @returns {Object} Tokens mới
 */
const refreshToken = async (refreshToken) => {
  try {
    // Verify refresh token
    const decoded = await jwtProvider.verifyToken(
      refreshToken,
      env.REFRESH_TOKEN_SECRET_KEY
    );

    // Tìm người dùng trong database
    const user = await userRepository.findById(decoded._id);
    if (!user) {
      throw new AuthenticationError("User not found or token invalid");
    }

    // Lấy thông tin vai trò
    const userRole = user.roleId
      ? await userRoleRepository.findById(user.roleId)
      : null;

    // Tạo thông tin người dùng cho token mới
    const userInfo = {
      _id: user._id,
      email: user.email,
      phone: user.phone,
      roleId: user.roleId,
      roleName: userRole ? userRole.roleName : null,
    };

    // Tạo access token mới
    const accessToken = await generateAccessToken(userInfo);

    return { accessToken };
  } catch (error) {
    throw new AuthenticationError("Invalid refresh token");
  }
};

export const authService = {
  login,
  refreshToken,
  generateAccessToken,
  generateRefreshToken,
};
