import { env } from "~/config/environment";
import { jwtProvider } from "~/providers/jwtProvider";
import { catchAsync } from "~/utils/catchAsync";
import { AuthenticationError } from "~/utils/errors";

/**
 * Middleware kiểm tra người dùng đã đăng nhập chưa
 * Kiểm tra JWT access token trong cookie hoặc header
 */
const authenticate = catchAsync(async (req, res, next) => {
  // Lấy token từ cookie hoặc Authorization header
  let token = req.cookies?.accessToken;

  // Nếu không có trong cookie, kiểm tra trong header
  if (!token && req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
    token = req.headers.authorization.split(" ")[1];
  }

  // Nếu không tìm thấy token
  if (!token) {
    throw new AuthenticationError("Bạn chưa đăng nhập. Vui lòng đăng nhập để tiếp tục.");
  }

  try {
    // Verify token
    const decoded = await jwtProvider.verifyToken(token, env.ACCESS_TOKEN_SECRET_KEY);

    // Lưu thông tin người dùng vào request object
    req.user = decoded;

    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      throw new AuthenticationError("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
    }

    throw new AuthenticationError("Token không hợp lệ. Vui lòng đăng nhập lại.");
  }
});

/**
 * Middleware giới hạn quyền truy cập dựa trên vai trò người dùng
 * @param  {...String} roles - Danh sách các vai trò được phép truy cập
 */
const restrictTo = (...roles) => {
  return (req, res, next) => {
    // Phải gọi sau middleware authenticate
    if (!req.user) {
      throw new AuthenticationError("Bạn chưa đăng nhập. Vui lòng đăng nhập để tiếp tục.");
    }

    // Kiểm tra xem người dùng có vai trò phù hợp không
    if (!roles.includes(req.user.role)) {
      throw new AuthenticationError("Bạn không có quyền thực hiện hành động này");
    }

    next();
  };
};

export const authMiddleware = {
  authenticate,
  restrictTo
};
