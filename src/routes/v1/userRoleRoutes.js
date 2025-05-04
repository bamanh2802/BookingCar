import express from "express";
import { PERMISSIONS } from "~/constants";
import { userRoleController } from "~/controllers/userRoleController";
import { authMiddleware } from "~/middlewares/authMiddleware";

const Router = express.Router();

// Lấy danh sách tất cả quyền hỗ trợ
Router.get(
  "/permissions",
  authMiddleware.authenticate,
  authMiddleware.hasPermission(PERMISSIONS.MANAGE_ROLES),
  userRoleController.getRolePermissions
);

// Lấy danh sách quyền của vai trò cụ thể
Router.get(
  "/:roleId/permissions",
  authMiddleware.authenticate,
  authMiddleware.hasPermission(PERMISSIONS.MANAGE_ROLES),
  userRoleController.getRolePermissions
);

// Các route CRUD cho vai trò (admin only)
Router.route("/")
  .get(
    authMiddleware.authenticate,
    authMiddleware.hasPermission(PERMISSIONS.MANAGE_ROLES),
    userRoleController.getAllRoles
  )
  .post(
    authMiddleware.authenticate,
    authMiddleware.hasPermission(PERMISSIONS.MANAGE_ROLES),
    userRoleController.createRole
  );

Router.route("/:roleId")
  .get(
    authMiddleware.authenticate,
    authMiddleware.hasPermission(PERMISSIONS.MANAGE_ROLES),
    userRoleController.getRoleById
  )
  .patch(
    authMiddleware.authenticate,
    authMiddleware.hasPermission(PERMISSIONS.MANAGE_ROLES),
    userRoleController.updateRole
  )
  .delete(
    authMiddleware.authenticate,
    authMiddleware.hasPermission(PERMISSIONS.MANAGE_ROLES),
    userRoleController.deleteRole
  );

// Cập nhật quyền cho vai trò
Router.patch(
  "/:roleId/permissions",
  authMiddleware.authenticate,
  authMiddleware.hasPermission(PERMISSIONS.MANAGE_ROLES),
  userRoleController.updateRolePermissions
);

// Cập nhật vai trò kế thừa
Router.patch(
  "/:roleId/inherits",
  authMiddleware.authenticate,
  authMiddleware.hasPermission(PERMISSIONS.MANAGE_ROLES),
  userRoleController.updateRoleInherits
);

export default Router;
