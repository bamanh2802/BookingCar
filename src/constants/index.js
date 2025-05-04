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
  MANAGE_USERS: "manage_users",
  MANAGE_ROUTES: "manage_routes",
  MANAGE_TICKETS: "manage_tickets",
  MANAGE_REFUNDS: "manage_refunds",
  MANAGE_REVIEWS: "manage_reviews",
  MANAGE_REPORTS: "manage_reports",
  VIEW_TICKETS_USERS: "view_tickets_users",
  VIEW_REPORTS_USERS: "view_reports_users",
  VIEW_TICKETS_AGENTS_LV2: "view_tickets_agents_lv2",
  VIEW_REPORTS_AGENTS_LV2: "view_reports_agents_lv2",
  MANAGE_AGENTS_LV2: "manage_agents_lv2",
  BOOK_TICKETS: "book_tickets",
  VIEW_HISTORY: "view_history",
  SUBMIT_REVIEWS: "submit_reviews",
  REQUEST_REFUNDS: "request_refunds",
};
