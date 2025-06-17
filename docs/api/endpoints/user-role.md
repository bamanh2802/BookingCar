# Role API

## Lấy danh sách vai trò

**Endpoint:** `GET /roles`

**Authentication:** Bearer Token

**Quyền cần thiết:** `VIEW_ROLES`

**Response (200):**

```json
{
  "statusCode": 200,
  "message": "Lấy danh sách vai trò thành công",
  "data": [
    {
      "_id": "6817abcdef1234567890abcd",
      "roleName": "Admin",
      "permissions": ["MANAGE_USERS", "MANAGE_ROLES"],
      "inherits": [],
      "createdAt": "2025-05-05T12:00:00.000Z",
      "updatedAt": "2025-05-05T12:00:00.000Z"
    },
    {
      "_id": "6817abcdef1234567890abce",
      "roleName": "AgentLv1",
      "permissions": ["MANAGE_AGENTS_LV2", "MANAGE_CLIENTS"],
      "inherits": [],
      "createdAt": "2025-05-05T12:00:00.000Z",
      "updatedAt": "2025-05-05T12:00:00.000Z"
    }
    // Các vai trò khác
  ]
}
```

## Tạo vai trò mới

**Endpoint:** `POST /roles`

**Authentication:** Bearer Token

**Quyền cần thiết:** `CREATE_ROLE`

**Request Body:**

```json
{
  "roleName": "CustomRole",
  "permissions": ["VIEW_DASHBOARD", "VIEW_PROFILE"],
  "inherits": ["6817abcdef1234567890abcd"]
}
```

**Response (201):**

```json
{
  "statusCode": 201,
  "message": "Tạo vai trò thành công",
  "data": {
    "_id": "6817abcdef1234567890abcf",
    "roleName": "CustomRole",
    "permissions": ["VIEW_DASHBOARD", "VIEW_PROFILE"],
    "inherits": ["6817abcdef1234567890abcd"],
    "createdAt": "2025-05-05T12:00:00.000Z",
    "updatedAt": "2025-05-05T12:00:00.000Z"
  }
}
```

## Lấy thông tin vai trò theo ID

**Endpoint:** `GET /roles/:roleId`

**Authentication:** Bearer Token

**Quyền cần thiết:** `VIEW_ROLES`

**Response (200):**

```json
{
  "statusCode": 200,
  "message": "Lấy thông tin vai trò thành công",
  "data": {
    "_id": "6817abcdef1234567890abcd",
    "roleName": "Admin",
    "permissions": ["MANAGE_USERS", "MANAGE_ROLES"],
    "inherits": [],
    "createdAt": "2025-05-05T12:00:00.000Z",
    "updatedAt": "2025-05-05T12:00:00.000Z"
  }
}
```

## Cập nhật thông tin vai trò

**Endpoint:** `PATCH /roles/:roleId`

**Authentication:** Bearer Token

**Quyền cần thiết:** `UPDATE_ROLE`

**Request Body:**

```json
{
  "roleName": "TênVaiTròMới"
}
```

**Response (200):**

```json
{
  "statusCode": 200,
  "message": "Cập nhật vai trò thành công",
  "data": {
    "_id": "6817abcdef1234567890abcd",
    "roleName": "TênVaiTròMới",
    "permissions": ["MANAGE_USERS", "MANAGE_ROLES"],
    "inherits": [],
    "createdAt": "2025-05-05T12:00:00.000Z",
    "updatedAt": "2025-05-05T12:00:00.000Z"
  }
}
```

## Xóa vai trò

**Endpoint:** `DELETE /roles/:roleId`

**Authentication:** Bearer Token

**Quyền cần thiết:** `DELETE_ROLE`

**Response (200):**

```json
{
  "statusCode": 200,
  "message": "Xóa vai trò thành công"
}
```

## Lấy danh sách tất cả quyền

**Endpoint:** `GET /roles/permissions`

**Authentication:** Bearer Token

**Quyền cần thiết:** `VIEW_ROLES`

**Response (200):**

```json
{
  "statusCode": 200,
  "message": "Lấy danh sách quyền thành công",
  "data": {
    "availablePermissions": [
      "view_users",
      "create_user",
      "update_user",
      "delete_user",
      "view_roles",
      "create_role",
      "update_role",
      "delete_role",
      "manage_role_permissions",
      "view_tickets",
      "create_ticket",
      "update_ticket",
      "delete_ticket",
      "view_detail_ticket",
      "view_history",
      "view_ticket_requests",
      "create_ticket_request",
      "update_ticket_request",
      "delete_ticket_request",
      "view_trips",
      "create_trip",
      "update_trip",
      "delete_trip",
      "view_detail_trips",
      "view_tickets_agents_lv2",
      "view_reports_agents_lv2",
      "view_tickets_clients",
      "view_reports_clients",
      "submit_reviews",
      "request_refunds"
    ]
  }
}
```

## Lấy quyền của vai trò cụ thể

**Endpoint:** `GET /roles/:roleId/permissions`

**Authentication:** Bearer Token

**Quyền cần thiết:** `VIEW_ROLES`

**Response (200):**

```json
{
  "statusCode": 200,
  "message": "Lấy danh sách quyền vai trò thành công",
  "data": {
    "name": "Admin",
    "permissions": [
      "view_users",
      "create_user",
      "update_user",
      "delete_user",
      "view_roles",
      "create_role",
      "update_role",
      "delete_role",
      "manage_role_permissions",
      "view_tickets",
      "create_ticket",
      "update_ticket",
      "delete_ticket",
      "view_detail_ticket",
      "view_history",
      "view_ticket_requests",
      "create_ticket_request",
      "update_ticket_request",
      "delete_ticket_request",
      "view_trips",
      "create_trip",
      "update_trip",
      "delete_trip",
      "view_detail_trips",
      "view_tickets_agents_lv2",
      "view_reports_agents_lv2",
      "view_tickets_clients",
      "view_reports_clients",
      "submit_reviews",
      "request_refunds"
    ]
  }
}
```

## Cập nhật quyền của vai trò

**Endpoint:** `PATCH /roles/:roleId/permissions`

**Authentication:** Bearer Token

**Quyền cần thiết:** `MANAGE_ROLE_PERMISSIONS`

**Request Body:**

```json
{
  "permissions": ["view_dashboard", "view_profile", "manage_clients"]
}
```

**Response (200):**

```json
{
  "statusCode": 200,
  "message": "Cập nhật quyền cho vai trò thành công",
  "data": {
    "_id": "6817abcdef1234567890abcd",
    "roleName": "CustomRole",
    "permissions": ["view_dashboard", "view_profile", "manage_clients"],
    "inherits": [],
    "createdAt": "2025-05-05T12:00:00.000Z",
    "updatedAt": "2025-05-05T12:00:00.000Z"
  }
}
```

## Cập nhật vai trò kế thừa

**Endpoint:** `PATCH /roles/:roleId/inherits`

**Authentication:** Bearer Token

**Quyền cần thiết:** `MANAGE_ROLE_PERMISSIONS`

**Request Body:**

```json
{
  "inherits": ["6817abcdef1234567890abcd", "6817abcdef1234567890abce"]
}
```

**Response (200):**

```json
{
  "statusCode": 200,
  "message": "Cập nhật kế thừa cho vai trò thành công",
  "data": {
    "_id": "6817abcdef1234567890abcf",
    "roleName": "CustomRole",
    "permissions": ["view_dashboard", "view_profile"],
    "inherits": ["6817abcdef1234567890abcd", "6817abcdef1234567890abce"],
    "createdAt": "2025-05-05T12:00:00.000Z",
    "updatedAt": "2025-05-05T12:00:00.000Z"
  }
}
```
