/**
 * File tập trung tất cả các constants trong dự án
 */

// Các roles của người dùng
export const USER_ROLES = {
  ADMIN: "Admin",
  AGENT_LV1: "AgentLv1",
  AGENT_LV2: "AgentLv2",
  CLIENT: "Client",
};

// Regular expressions và rules cho validation
export const VALIDATION_RULES = {
  // Regex cho số điện thoại Việt Nam
  PHONE_NUMBER_RULE: /^(0|84)(3|5|7|8|9)[0-9]{8}$/,

  // Độ dài tối thiểu cho mật khẩu
  PASSWORD_MIN_LENGTH: 6,

  // Độ dài tối đa cho tên đầy đủ
  FULLNAME_MAX_LENGTH: 100,

  // Độ dài tối thiểu cho tên đầy đủ
  FULLNAME_MIN_LENGTH: 2,
};

// Các tên document/model trong database
export const DOCUMENT_NAMES = {
  USER: "User",
  USER_ROLE: "UserRole",
  BANK_ACCOUNT: "BankAccount",
};

// Các quyền hạn chi tiết
export const PERMISSIONS = {
  // Quyền quản trị hệ thống
  MANAGE_USERS: "manage_users",
  MANAGE_ROLES: "manage_roles",
  MANAGE_ROUTES: "manage_routes",
  MANAGE_TICKETS: "manage_tickets",
  MANAGE_REFUNDS: "manage_refunds",
  MANAGE_REVIEWS: "manage_reviews",
  MANAGE_REPORTS: "manage_reports",

  // Quyền đại lý cấp 1
  MANAGE_AGENTS_LV2: "manage_agents_lv2",
  VIEW_TICKETS_AGENTS_LV2: "view_tickets_agents_lv2",
  VIEW_REPORTS_AGENTS_LV2: "view_reports_agents_lv2",

  // Quyền đại lý cấp 2
  MANAGE_CLIENTS: "manage_clients",
  VIEW_TICKETS_CLIENTS: "view_tickets_clients",
  VIEW_REPORTS_CLIENTS: "view_reports_clients",

  // Quyền người dùng
  BOOK_TICKETS: "book_tickets",
  VIEW_HISTORY: "view_history",
  SUBMIT_REVIEWS: "submit_reviews",
  REQUEST_REFUNDS: "request_refunds",
};

// Phân quyền mặc định cho từng vai trò
export const DEFAULT_ROLE_PERMISSIONS = {
  [USER_ROLES.ADMIN]: [
    PERMISSIONS.MANAGE_USERS,
    PERMISSIONS.MANAGE_ROLES,
    PERMISSIONS.MANAGE_ROUTES,
    PERMISSIONS.MANAGE_TICKETS,
    PERMISSIONS.MANAGE_REFUNDS,
    PERMISSIONS.MANAGE_REVIEWS,
    PERMISSIONS.MANAGE_REPORTS,
    PERMISSIONS.MANAGE_AGENTS_LV2,
    PERMISSIONS.VIEW_TICKETS_AGENTS_LV2,
    PERMISSIONS.VIEW_REPORTS_AGENTS_LV2,
    PERMISSIONS.MANAGE_CLIENTS,
    PERMISSIONS.VIEW_TICKETS_CLIENTS,
    PERMISSIONS.VIEW_REPORTS_CLIENTS,
    PERMISSIONS.BOOK_TICKETS,
    PERMISSIONS.VIEW_HISTORY,
    PERMISSIONS.SUBMIT_REVIEWS,
    PERMISSIONS.REQUEST_REFUNDS,
  ],
  [USER_ROLES.AGENT_LV1]: [
    PERMISSIONS.MANAGE_AGENTS_LV2,
    PERMISSIONS.VIEW_TICKETS_AGENTS_LV2,
    PERMISSIONS.VIEW_REPORTS_AGENTS_LV2,
    PERMISSIONS.BOOK_TICKETS,
    PERMISSIONS.VIEW_HISTORY,
  ],
  [USER_ROLES.AGENT_LV2]: [
    PERMISSIONS.MANAGE_CLIENTS,
    PERMISSIONS.VIEW_TICKETS_CLIENTS,
    PERMISSIONS.VIEW_REPORTS_CLIENTS,
    PERMISSIONS.BOOK_TICKETS,
    PERMISSIONS.VIEW_HISTORY,
  ],
  [USER_ROLES.CLIENT]: [
    PERMISSIONS.BOOK_TICKETS,
    PERMISSIONS.VIEW_HISTORY,
    PERMISSIONS.SUBMIT_REVIEWS,
    PERMISSIONS.REQUEST_REFUNDS,
  ],
};
