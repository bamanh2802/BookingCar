# User API

## Đăng ký

**Endpoint:** `POST /user/register`

**Authentication:** Không cần

**Request Body:**

```json
{
  "email": "testuser@example.com",
  "password": "Abc123!@#",
  "fullName": "Người dùng test",
  "phone": "0912345678"
}
```

**Response (201):**

```json
{
  "statusCode": 201,
  "message": "Đăng ký tài khoản thành công",
  "data": {
    "_id": "6817abcdef1234567890abcd",
    "email": "testuser@example.com",
    "fullName": "Người dùng test",
    "phone": "0912345678",
    "roleId": "6817abcdef1234567890abce",
    "createdAt": "2025-05-05T12:00:00.000Z",
    "updatedAt": "2025-05-05T12:00:00.000Z"
  }
}
```

## Đăng nhập

**Endpoint:** `POST /user/login`

**Authentication:** Không cần

**Request Body:**

```json
{
  "email": "admin@bookingcar.com",
  "password": "Admin@123"
}
```

**Response (200):**

```json
{
  "statusCode": 200,
  "message": "Đăng nhập thành công",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1...",
    "refreshToken": "eyJhbGciOiJIUzI1...",
    "_id": "6817abcdef1234567890abcd",
    "email": "admin@bookingcar.com",
    "fullName": "Administrator",
    "phone": "0987654321",
    "roleId": "6817abcdef1234567890abce",
    "roleName": "Admin"
  }
}
```

## Làm mới token

**Endpoint:** `POST /user/refresh-token`

**Authentication:** Refresh token trong cookie

**Response (200):**

```json
{
  "statusCode": 200,
  "message": "Refresh token thành công",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1..."
  }
}
```

## Lấy thông tin cá nhân

**Endpoint:** `GET /user/profile`

**Authentication:** Bearer Token

**Response (200):**

```json
{
  "statusCode": 200,
  "message": "Lấy thông tin người dùng thành công",
  "data": {
    "_id": "6817abcdef1234567890abcd",
    "email": "testuser@example.com",
    "fullName": "Người dùng test",
    "phone": "0912345678",
    "roleId": "6817abcdef1234567890abce",
    "createdAt": "2025-05-05T12:00:00.000Z",
    "updatedAt": "2025-05-05T12:00:00.000Z"
  }
}
```

## Cập nhật thông tin cá nhân

**Endpoint:** `PATCH /user/profile`

**Authentication:** Bearer Token

**Request Body:**

```json
{
  "fullName": "Tên mới"
}
```

**Response (200):**

```json
{
  "statusCode": 200,
  "message": "Cập nhật thông tin thành công",
  "data": {
    "_id": "6817abcdef1234567890abcd",
    "email": "testuser@example.com",
    "fullName": "Tên mới",
    "phone": "0912345678",
    "roleId": "6817abcdef1234567890abce",
    "createdAt": "2025-05-05T12:00:00.000Z",
    "updatedAt": "2025-05-05T12:00:00.000Z"
  }
}
```

## Lấy danh sách người dùng

**Endpoint:** `GET /user/list`

**Authentication:** Bearer Token

**Quyền cần thiết:** `MANAGE_USERS`, `MANAGE_AGENTS_LV2`, hoặc `MANAGE_CLIENTS`

**Query Parameters:**

- `page`: Trang (mặc định 1)
- `limit`: Số lượng kết quả mỗi trang (mặc định 10)
- `roleId`: Lọc theo vai trò
- `parentId`: Lọc theo người tạo

**Response (200):**

```json
{
  "statusCode": 200,
  "message": "Lấy danh sách người dùng thành công",
  "data": {
    "results": [
      {
        "_id": "6817abcdef1234567890abcd",
        "email": "user1@example.com",
        "fullName": "Người dùng 1",
        "phone": "0901234567",
        "roleId": "6817abcdef1234567890abce",
        "parentId": "6817abcdef1234567890abcf"
      }
      / Các user khác
    ],
    "pagination": {
      "total": 25,
      "page": 1,
      "limit": 10,
      "totalPages": 3
    }
  }
}
```

## Tạo người dùng mới

**Endpoint:** `POST /user/create`

**Authentication:** Bearer Token

**Quyền cần thiết:** `CREATE_USER`

**Request Body:**

```json
{
  "email": "newuser@example.com",
  "password": "Abc123!@#",
  "fullName": "Người dùng mới",
  "phone": "0912345678",
  "roleName": "Client"
}
```

**Lưu ý về Role:**
- Có thể sử dụng `roleName` (khuyến nghị) hoặc `roleId`
- Nếu cung cấp cả hai, `roleName` sẽ được ưu tiên
- Các giá trị `roleName` hợp lệ: `Admin`, `AgentLv1`, `AgentLv2`, `Client`
- Nếu không cung cấp role nào, mặc định sẽ là `Client`

**Mô tả các Role:**
- `Admin`: Quản trị viên hệ thống - có toàn quyền
- `AgentLv1`: Đại lý cấp 1 - có thể tạo AgentLv2 và Client
- `AgentLv2`: Đại lý cấp 2 - có thể tạo Client
- `Client`: Khách hàng - người dùng cuối

**Response (201):**

```json
{
  "statusCode": 201,
  "message": "Tạo người dùng thành công",
  "data": {
    "_id": "6817abcdef1234567890abcd",
    "email": "newuser@example.com",
    "fullName": "Người dùng mới",
    "phone": "0912345678",
    "roleId": "6817abcdef1234567890abce",
    "parentId": "6817abcdef1234567890abcf",
    "createdAt": "2025-05-05T12:00:00.000Z",
    "updatedAt": "2025-05-05T12:00:00.000Z"
  }
}
```

## Lấy thông tin người dùng theo ID

**Endpoint:** `GET /user/:userId`

**Authentication:** Bearer Token

**Quyền cần thiết:** `MANAGE_USERS`, `MANAGE_AGENTS_LV2`, hoặc `MANAGE_CLIENTS`

**Response (200):**

```json
{
  "statusCode": 200,
  "message": "Lấy thông tin người dùng thành công",
  "data": {
    "_id": "6817abcdef1234567890abcd",
    "email": "user@example.com",
    "fullName": "Người dùng",
    "phone": "0912345678",
    "roleId": "6817abcdef1234567890abce",
    "parentId": "6817abcdef1234567890abcf",
    "createdAt": "2025-05-05T12:00:00.000Z",
    "updatedAt": "2025-05-05T12:00:00.000Z"
  }
}
```

## Cập nhật thông tin người dùng

**Endpoint:** `PATCH /user/:userId`

**Authentication:** Bearer Token

**Quyền cần thiết:** `MANAGE_USERS`, `MANAGE_AGENTS_LV2`, hoặc `MANAGE_CLIENTS`

**Request Body:**

```json
{
  "fullName": "Tên đã cập nhật"
}
```

**Response (200):**

```json
{
  "statusCode": 200,
  "message": "Cập nhật thông tin người dùng thành công",
  "data": {
    "_id": "6817abcdef1234567890abcd",
    "email": "user@example.com",
    "fullName": "Tên đã cập nhật",
    "phone": "0912345678",
    "roleId": "6817abcdef1234567890abce",
    "parentId": "6817abcdef1234567890abcf",
    "createdAt": "2025-05-05T12:00:00.000Z",
    "updatedAt": "2025-05-05T12:00:00.000Z"
  }
}
```
