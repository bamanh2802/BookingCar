/**
 * File tập trung tất cả các constants trong dự án
 */

// Các roles của người dùng
export const USER_ROLES = {
  ADMIN: 'Admin',
  AGENT_LV1: 'AgentLv1',
  AGENT_LV2: 'AgentLv2',
  CLIENT: 'Client'
}

// Các trạng thái của vé
export const TICKET_STATUS = {
  PENDING: 'Pending', // Chờ xử lý // chưa thanh toán
  CONFIRMED: 'Confirmed', // Đã xác nhận // thanh toán thành công
  CANCELLED: 'Cancelled', // Đã hủy
  REFUNDED: 'Refunded', // Đã hoàn tiền
  DONE: 'Done' // Đã hoàn thành chuyến đi
}

// Các loại xe trong hệ thống
export const CAR_TYPES = {
  VIP: 'VIP',
  REGULAR: 'Regular'
}

// Regular expressions và rules cho validation
export const VALIDATION_RULES = {
  // Regex cho số điện thoại Việt Nam
  PHONE_NUMBER_RULE: /^(0|84)(3|5|7|8|9)[0-9]{8}$/,

  // Độ dài tối thiểu cho mật khẩu
  PASSWORD_MIN_LENGTH: 6,

  // Độ dài tối đa cho tên đầy đủ
  FULLNAME_MAX_LENGTH: 100,

  // Độ dài tối thiểu cho tên đầy đủ
  FULLNAME_MIN_LENGTH: 2
}

// Các tên document/model trong database
export const DOCUMENT_NAMES = {
  USER: 'User',
  USER_ROLE: 'UserRole',
  BANK_ACCOUNT: 'BankAccount',
  CAR_COMPANY: 'CarCompany',
  TICKET: 'Ticket',
  TRIP: 'Trip',
  SEAT_MAP: 'SeatMap',
  TICKET_REQUEST: 'TicketRequest'
}

// Các quyền hạn chi tiết
export const PERMISSIONS = {
  // Quyền user chi tiết
  VIEW_USERS: 'view_users',
  CREATE_USER: 'create_user',
  UPDATE_USER: 'update_user',
  DELETE_USER: 'delete_user',

  // Quyền role management chi tiết
  VIEW_ROLES: 'view_roles',
  CREATE_ROLE: 'create_role',
  UPDATE_ROLE: 'update_role',
  DELETE_ROLE: 'delete_role',
  MANAGE_ROLE_PERMISSIONS: 'manage_role_permissions',

  // Quyền ticket chi tiết
  VIEW_TICKETS: 'view_tickets',
  CREATE_TICKET: 'create_ticket',
  UPDATE_TICKET: 'update_ticket',
  DELETE_TICKET: 'delete_ticket',
  VIEW_DETAIL_TICKET: 'view_detail_ticket',
  VIEW_HISTORY: 'view_history',

  // Quyền ticket request chi tiết
  VIEW_TICKET_REQUESTS: 'view_ticket_requests',
  CREATE_TICKET_REQUEST: 'create_ticket_request',
  UPDATE_TICKET_REQUEST: 'update_ticket_request',
  DELETE_TICKET_REQUEST: 'delete_ticket_request',

  // Quyền trip chi tiết
  VIEW_TRIPS: 'view_trips',
  CREATE_TRIP: 'create_trip',
  UPDATE_TRIP: 'update_trip',
  DELETE_TRIP: 'delete_trip',
  VIEW_DETAIL_TRIP: 'view_detail_trips',
  MANAGE_ROUTES: 'manage_routes',

  // Quyền đại lý cấp 1
  VIEW_TICKETS_AGENTS_LV2: 'view_tickets_agents_lv2',
  VIEW_REPORTS_AGENTS_LV2: 'view_reports_agents_lv2',

  // Quyền đại lý cấp 2
  VIEW_TICKETS_CLIENTS: 'view_tickets_clients',
  VIEW_REPORTS_CLIENTS: 'view_reports_clients',

  // Quyền người dùng
  SUBMIT_REVIEWS: 'submit_reviews',
  REQUEST_REFUNDS: 'request_refunds'
}

// Phân quyền mặc định cho từng vai trò
export const DEFAULT_ROLE_PERMISSIONS = {
  [USER_ROLES.ADMIN]: [
    PERMISSIONS.VIEW_USERS,
    PERMISSIONS.CREATE_USER,
    PERMISSIONS.UPDATE_USER,
    PERMISSIONS.DELETE_USER,
    PERMISSIONS.VIEW_ROLES,
    PERMISSIONS.CREATE_ROLE,
    PERMISSIONS.UPDATE_ROLE,
    PERMISSIONS.DELETE_ROLE,
    PERMISSIONS.MANAGE_ROLE_PERMISSIONS,
    PERMISSIONS.VIEW_TICKETS,
    PERMISSIONS.CREATE_TICKET,
    PERMISSIONS.UPDATE_TICKET,
    PERMISSIONS.DELETE_TICKET,
    PERMISSIONS.VIEW_DETAIL_TICKET,
    PERMISSIONS.VIEW_HISTORY,
    PERMISSIONS.VIEW_TICKET_REQUESTS,
    PERMISSIONS.CREATE_TICKET_REQUEST,
    PERMISSIONS.UPDATE_TICKET_REQUEST,
    PERMISSIONS.DELETE_TICKET_REQUEST,
    PERMISSIONS.VIEW_TRIPS,
    PERMISSIONS.CREATE_TRIP,
    PERMISSIONS.UPDATE_TRIP,
    PERMISSIONS.DELETE_TRIP,
    PERMISSIONS.VIEW_DETAIL_TRIP,
    PERMISSIONS.MANAGE_ROUTES,
    PERMISSIONS.VIEW_TICKETS_AGENTS_LV2,
    PERMISSIONS.VIEW_REPORTS_AGENTS_LV2,
    PERMISSIONS.VIEW_TICKETS_CLIENTS,
    PERMISSIONS.VIEW_REPORTS_CLIENTS,
    PERMISSIONS.SUBMIT_REVIEWS,
    PERMISSIONS.REQUEST_REFUNDS
  ],
  [USER_ROLES.AGENT_LV1]: [
    PERMISSIONS.VIEW_USERS,
    PERMISSIONS.CREATE_USER,
    PERMISSIONS.UPDATE_USER,
    PERMISSIONS.VIEW_TICKETS,
    PERMISSIONS.CREATE_TICKET,
    PERMISSIONS.UPDATE_TICKET,
    PERMISSIONS.VIEW_DETAIL_TICKET,
    PERMISSIONS.VIEW_HISTORY,
    PERMISSIONS.VIEW_TICKET_REQUESTS,
    PERMISSIONS.CREATE_TICKET_REQUEST,
    PERMISSIONS.UPDATE_TICKET_REQUEST,
    PERMISSIONS.VIEW_TRIPS,
    PERMISSIONS.VIEW_DETAIL_TRIP,
    PERMISSIONS.VIEW_TICKETS_AGENTS_LV2,
    PERMISSIONS.VIEW_REPORTS_AGENTS_LV2
  ],
  [USER_ROLES.AGENT_LV2]: [
    PERMISSIONS.VIEW_USERS,
    PERMISSIONS.CREATE_USER,
    PERMISSIONS.UPDATE_USER,
    PERMISSIONS.VIEW_TICKETS,
    PERMISSIONS.CREATE_TICKET,
    PERMISSIONS.UPDATE_TICKET,
    PERMISSIONS.VIEW_DETAIL_TICKET,
    PERMISSIONS.VIEW_HISTORY,
    PERMISSIONS.VIEW_TICKET_REQUESTS,
    PERMISSIONS.CREATE_TICKET_REQUEST,
    PERMISSIONS.UPDATE_TICKET_REQUEST,
    PERMISSIONS.VIEW_TRIPS,
    PERMISSIONS.VIEW_DETAIL_TRIP,
    PERMISSIONS.VIEW_TICKETS_CLIENTS,
    PERMISSIONS.VIEW_REPORTS_CLIENTS
  ],
  [USER_ROLES.CLIENT]: [
    PERMISSIONS.VIEW_DETAIL_TICKET,
    PERMISSIONS.VIEW_HISTORY,
    PERMISSIONS.VIEW_TICKET_REQUESTS,
    PERMISSIONS.CREATE_TICKET_REQUEST,
    PERMISSIONS.VIEW_TRIPS,
    PERMISSIONS.VIEW_DETAIL_TRIP,
    PERMISSIONS.SUBMIT_REVIEWS,
    PERMISSIONS.REQUEST_REFUNDS
  ]
}
