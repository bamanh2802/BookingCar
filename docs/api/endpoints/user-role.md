# Role API

## Lấy danh sách vai trò

**Endpoint:** `GET /roles`

**Authentication:** Bearer Token

**Quyền cần thiết:** `MANAGE_ROLES`

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
    / Các vai trò khác
  ]
}
```

## Tạo vai trò mới

**Endpoint:** `POST /roles`

**Authentication:** Bearer Token

**Quyền cần thiết:** `MANAGE_ROLES`

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

**Quyền cần thiết:** `MANAGE_ROLES`

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

**Quyền cần thiết:** `MANAGE_ROLES`

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

**Quyền cần thiết:** `MANAGE_ROLES`

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

**Quyền cần thiết:** `MANAGE_ROLES`

**Response (200):**

```json
{
  "statusCode": 200,
  "message": "Lấy danh sách quyền thành công",
  "data": {
    "availablePermissions": [
      "MANAGE_USERS",
      "MANAGE_ROLES",
      "MANAGE_AGENTS_LV1",
      "MANAGE_AGENTS_LV2",
      "MANAGE_CLIENTS",
      "VIEW_DASHBOARD",
      "VIEW_REPORTS"
    ]
  }
}
```

## Lấy quyền của vai trò cụ thể

**Endpoint:** `GET /roles/:roleId/permissions`

**Authentication:** Bearer Token

**Quyền cần thiết:** `MANAGE_ROLES`

**Response (200):**

```json
{
  "statusCode": 200,
  "message": "Lấy danh sách quyền vai trò thành công",
  "data": {
    "name": "Admin",
    "permissions": [
      "MANAGE_USERS",
      "MANAGE_ROLES",
      "MANAGE_AGENTS_LV1",
      "MANAGE_AGENTS_LV2",
      "MANAGE_CLIENTS",
      "VIEW_DASHBOARD",
      "VIEW_REPORTS"
    ]
  }
}
```

## Cập nhật quyền của vai trò

**Endpoint:** `PATCH /roles/:roleId/permissions`

**Authentication:** Bearer Token

**Quyền cần thiết:** `MANAGE_ROLES`

**Request Body:**

```json
{
  "permissions": ["VIEW_DASHBOARD", "VIEW_PROFILE", "MANAGE_CLIENTS"]
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
    "permissions": ["VIEW_DASHBOARD", "VIEW_PROFILE", "MANAGE_CLIENTS"],
    "inherits": [],
    "createdAt": "2025-05-05T12:00:00.000Z",
    "updatedAt": "2025-05-05T12:00:00.000Z"
  }
}
```

## Cập nhật vai trò kế thừa

**Endpoint:** `PATCH /roles/:roleId/inherits`

**Authentication:** Bearer Token

**Quyền cần thiết:** `MANAGE_ROLES`

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
    "permissions": ["VIEW_DASHBOARD", "VIEW_PROFILE"],
    "inherits": ["6817abcdef1234567890abcd", "6817abcdef1234567890abce"],
    "createdAt": "2025-05-05T12:00:00.000Z",
    "updatedAt": "2025-05-05T12:00:00.000Z"
  }
}
```
