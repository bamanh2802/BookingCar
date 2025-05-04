import { loginSchema, registerSchema, updateUserSchema } from "./schemas/userSchema";
import { validateRequest } from "./validateRequest";

/**
 * Middleware validation cho đăng ký người dùng
 */
const register = validateRequest(registerSchema);

/**
 * Middleware validation cho đăng nhập
 */
const login = validateRequest(loginSchema);

/**
 * Middleware validation cho cập nhật thông tin người dùng
 */
const updateProfile = validateRequest(updateUserSchema);

export const userValidation = {
  register,
  login,
  updateProfile
};
