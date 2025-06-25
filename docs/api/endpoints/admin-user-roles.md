# Admin User Role Management API

## Base URL
```
http://localhost:8080/v1/admin
```

## Authentication
Tất cả endpoint admin yêu cầu header:
```
Authorization: Bearer <admin_token>
```

---

## USER ROLE MANAGEMENT

### Get User Role Stats
```
GET /user-roles/stats
```

### Get Available Permissions
```
GET /user-roles/permissions
```

### Get All User Roles
```
GET /user-roles
Query Parameters:
- page (number): Trang hiện tại (default: 1)
- limit (number): Số lượng mỗi trang (default: 10)
- search (string): Tìm kiếm theo tên role
- isActive (boolean): Lọc theo trạng thái
```

### Create User Role
```
POST /user-roles
Body:
{
  "roleName": "string (required)",
  "description": "string",
  "permissions": ["string array"],
  "inheritFrom": "string (roleId)",
  "isActive": "boolean (default: true)",
  "level": "number (priority level)"
}
```

### Get User Role by ID
```
GET /user-roles/:roleId
```

### Update User Role
```
PATCH /user-roles/:roleId
Body: (tương tự create nhưng tất cả field optional)
```

### Delete User Role
```
DELETE /user-roles/:roleId
```

### Toggle User Role Status
```
PATCH /user-roles/:roleId/toggle-status
Body:
{
  "isActive": "boolean (required)"
}
```

### Update Role Permissions
```
PATCH /user-roles/:roleId/permissions
Body:
{
  "permissions": ["string array (required)"]
}
```

### Set Role Inheritance
```
PATCH /user-roles/:roleId/inheritance
Body:
{
  "inheritFrom": "string (roleId or null)"
}
```

### Duplicate User Role
```
POST /user-roles/:roleId/duplicate
Body:
{
  "newRoleName": "string (required)",
  "description": "string"
}
```

### Get Users by Role
```
GET /user-roles/:roleId/users
Query Parameters:
- page (number): Trang hiện tại (default: 1)
- limit (number): Số lượng mỗi trang (default: 10)
```

## Response Format

### Success Response
```json
{
  "success": true,
  "message": "Success message",
  "data": {...},
  "metadata": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message",
  "errors": {...}
}
``` 