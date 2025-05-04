import express from "express";
import { PERMISSIONS, USER_ROLES } from "~/constants";
import { userController } from "~/controllers/userController";
import { authMiddleware } from "~/middlewares/authMiddleware";
import ApiResponse from "~/utils/ApiResponse";
import { userValidation } from "~/validations/userValidation";

const Router = express.Router();

// Route public - GET
Router.route("/").get((req, res) => {
  res.status(200).json(ApiResponse.success({ message: "User API" }));
});

// Route đăng ký và đăng nhập - không cần xác thực
Router.route("/register").post(
  userValidation.register,
  userController.register
);
Router.route("/login").post(userValidation.login, userController.login);
Router.route("/refresh-token").post(userController.refreshToken);

// Các routes yêu cầu xác thực
Router.route("/profile")
  .get(authMiddleware.authenticate, userController.getProfile)
  .patch(
    authMiddleware.authenticate,
    userValidation.updateProfile,
    userController.updateProfile
  );

// Route lấy danh sách người dùng (cần quyền tương ứng)
Router.route("/list").get(
  authMiddleware.authenticate,
  authMiddleware.hasPermission(
    PERMISSIONS.MANAGE_USERS,
    PERMISSIONS.MANAGE_AGENTS_LV2,
    PERMISSIONS.MANAGE_CLIENTS
  ),
  userController.getUsers
);

// Route tạo người dùng mới (cần quyền tương ứng)
Router.route("/create").post(
  authMiddleware.authenticate,
  authMiddleware.hasPermission(
    PERMISSIONS.MANAGE_USERS,
    PERMISSIONS.MANAGE_AGENTS_LV2,
    PERMISSIONS.MANAGE_CLIENTS
  ),
  userValidation.register,
  userController.createUser
);

// Route quản lý người dùng cụ thể (cần quyền tương ứng và kiểm tra quyền quản lý)
Router.route("/:userId")
  .get(
    authMiddleware.authenticate,
    authMiddleware.hasPermission(
      PERMISSIONS.MANAGE_USERS,
      PERMISSIONS.MANAGE_AGENTS_LV2,
      PERMISSIONS.MANAGE_CLIENTS
    ),
    authMiddleware.canManageUser,
    userController.getUserById
  )
  .patch(
    authMiddleware.authenticate,
    authMiddleware.hasPermission(
      PERMISSIONS.MANAGE_USERS,
      PERMISSIONS.MANAGE_AGENTS_LV2,
      PERMISSIONS.MANAGE_CLIENTS
    ),
    authMiddleware.canManageUser,
    userValidation.updateProfile,
    userController.updateUser
  );

// Route yêu cầu xác thực và phân quyền - Admin only
Router.route("/admin-area").get(
  authMiddleware.authenticate,
  authMiddleware.restrictTo(USER_ROLES.ADMIN),
  (req, res) => {
    res.status(200).json(ApiResponse.success({ message: "Admin area" }));
  }
);

// Route yêu cầu xác thực và phân quyền - Agent Level 1 only
Router.route("/agent-lv1-area").get(
  authMiddleware.authenticate,
  authMiddleware.restrictTo(USER_ROLES.AGENT_LV1),
  (req, res) => {
    res
      .status(200)
      .json(ApiResponse.success({ message: "Agent Level 1 area" }));
  }
);

// Route yêu cầu xác thực và phân quyền - Agent Level 2 only
Router.route("/agent-lv2-area").get(
  authMiddleware.authenticate,
  authMiddleware.restrictTo(USER_ROLES.AGENT_LV2),
  (req, res) => {
    res
      .status(200)
      .json(ApiResponse.success({ message: "Agent Level 2 area" }));
  }
);

export const userRoutes = Router;
