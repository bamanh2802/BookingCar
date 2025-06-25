/**
 * File tập trung tất cả các constants trong dự án
 */

export const REASON_REFUND = {
  TICKET_CANCELLED: 'Ticket Cancelled', // Vé bị hủy
  TRIP_CANCELLED: 'Trip Cancelled', // Chuyến đi bị hủy
  USER_REQUEST: 'User Request', // Yêu cầu từ người dùng
  COMMISSION_PAID: 'Commission Paid', // Hoa hồng đã trả
  AGENCY_COMMISSION: 'Agency Commission' // Hoa hồng cho đại lý
}

// Các tiêu đề cho trip
export const TRIP_TITLES = {
  NOT_STARTED: 'Not Started', // Chưa bắt đầu
  COMPLETED: 'Completed', // Đã hoàn thành
  DELAYED: 'Delayed' // Bị trì hoãn
}

//Các tiêu đề yêu cầu
export const TITLE_TICKET_REQUESTS = {
  BOOK_TICKET: 'Book Ticket',
  CANCEL_TICKET: 'Cancel Ticket',
  REFUND: 'Refund Ticket'
}

export const REFUND_STATUS = {
  PENDING: 'Pending', // Chờ xử lý
  COMPLETED: 'Completed', // Đã hoàn tiền
  FAILED: 'Failed' // Thất bại
}

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
  REJECTED: 'Rejected', // Bị từ chối
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
  FULLNAME_MIN_LENGTH: 2,

  // Regex cho định dạng số tài khoản ngân hàng
  BANK_ACCOUNT_NUMBER_RULE: /^\d{8,20}$/
}

// Các tên document/model trong database
export const DOCUMENT_NAMES = {
  USER: 'User',
  USER_ROLE: 'UserRole',
  BANK_ACCOUNT: 'BankAccount',
  CAR_COMPANY: 'CarCompany',
  VEHICLE: 'Vehicle',
  TICKET: 'Ticket',
  TRIP: 'Trip',
  SEAT_MAP: 'SeatMap',
  TICKET_REQUEST: 'TicketRequest',
  COMMISSION: 'Commission',
  REFUND_HISTORY: 'RefundHistory',
  COMMISSION_PAID_HISTORY: 'CommissionPaidHistory'
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

  // Quyền vehicle chi tiết
  VIEW_VEHICLES: 'view_vehicles',
  CREATE_VEHICLE: 'create_vehicle',
  UPDATE_VEHICLE: 'update_vehicle',
  DELETE_VEHICLE: 'delete_vehicle',
  VIEW_DETAIL_VEHICLE: 'view_detail_vehicle',

  // Quyền đại lý cấp 1
  VIEW_TICKETS_AGENTS_LV2: 'view_tickets_agents_lv2',
  VIEW_REPORTS_AGENTS_LV2: 'view_reports_agents_lv2',

  // Quyền đại lý cấp 2
  VIEW_TICKETS_CLIENTS: 'view_tickets_clients',
  VIEW_REPORTS_CLIENTS: 'view_reports_clients',

  // Quyền người dùng
  SUBMIT_REVIEWS: 'submit_reviews',
  REQUEST_REFUNDS: 'request_refunds',

  //các quyền liên quan đến ngân hàng
  VIEW_BANK_ACCOUNT: 'view_bank_account',
  UPDATE_BANK_ACCOUNT: 'update_bank_account',
  DELETE_BANK_ACCOUNT: 'delete_bank_account',
  CREATE_BANK_ACCOUNT: 'create_bank_account',
  // Quyền xác minh tài khoản ngân hàng
  VERIFY_BANK_ACCOUNT: 'verify_bank_account'
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
    PERMISSIONS.VIEW_VEHICLES,
    PERMISSIONS.CREATE_VEHICLE,
    PERMISSIONS.UPDATE_VEHICLE,
    PERMISSIONS.DELETE_VEHICLE,
    PERMISSIONS.VIEW_DETAIL_VEHICLE,
    PERMISSIONS.VIEW_TICKETS_AGENTS_LV2,
    PERMISSIONS.VIEW_REPORTS_AGENTS_LV2,
    PERMISSIONS.VIEW_TICKETS_CLIENTS,
    PERMISSIONS.VIEW_REPORTS_CLIENTS,
    PERMISSIONS.SUBMIT_REVIEWS,
    PERMISSIONS.REQUEST_REFUNDS,
    PERMISSIONS.VIEW_BANK_ACCOUNT,
    PERMISSIONS.UPDATE_BANK_ACCOUNT,
    PERMISSIONS.DELETE_BANK_ACCOUNT,
    PERMISSIONS.CREATE_BANK_ACCOUNT,
    PERMISSIONS.VERIFY_BANK_ACCOUNT
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
    PERMISSIONS.VIEW_VEHICLES,
    PERMISSIONS.VIEW_DETAIL_VEHICLE,
    PERMISSIONS.VIEW_TICKETS_AGENTS_LV2,
    PERMISSIONS.VIEW_REPORTS_AGENTS_LV2,
    PERMISSIONS.VIEW_BANK_ACCOUNT,
    PERMISSIONS.UPDATE_BANK_ACCOUNT,
    PERMISSIONS.DELETE_BANK_ACCOUNT,
    PERMISSIONS.CREATE_BANK_ACCOUNT,
    PERMISSIONS.DELETE_TICKET_REQUEST
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
    PERMISSIONS.VIEW_VEHICLES,
    PERMISSIONS.VIEW_DETAIL_VEHICLE,
    PERMISSIONS.VIEW_TICKETS_CLIENTS,
    PERMISSIONS.VIEW_REPORTS_CLIENTS,
    PERMISSIONS.VIEW_BANK_ACCOUNT,
    PERMISSIONS.UPDATE_BANK_ACCOUNT,
    PERMISSIONS.DELETE_BANK_ACCOUNT,
    PERMISSIONS.CREATE_BANK_ACCOUNT,
    PERMISSIONS.DELETE_TICKET_REQUEST
  ],
  [USER_ROLES.CLIENT]: [
    PERMISSIONS.VIEW_DETAIL_TICKET,
    PERMISSIONS.VIEW_HISTORY,
    PERMISSIONS.VIEW_TICKET_REQUESTS,
    PERMISSIONS.CREATE_TICKET_REQUEST,
    PERMISSIONS.VIEW_TRIPS,
    PERMISSIONS.VIEW_DETAIL_TRIP,
    PERMISSIONS.SUBMIT_REVIEWS,
    PERMISSIONS.REQUEST_REFUNDS,
    PERMISSIONS.VIEW_BANK_ACCOUNT,
    PERMISSIONS.UPDATE_BANK_ACCOUNT,
    PERMISSIONS.DELETE_BANK_ACCOUNT,
    PERMISSIONS.CREATE_BANK_ACCOUNT,
    PERMISSIONS.DELETE_TICKET_REQUEST
  ]
}
