# Admin API Endpoints Documentation

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

## API Modules

### 1. [Company Management](admin-companies.md)
- Quản lý các công ty vận tải
- CRUD operations và toggle status
- Endpoints: GET, POST, PATCH, DELETE `/companies`

### 2. [Vehicle Management](admin-vehicles.md)
- Quản lý phương tiện của các công ty
- Quản lý trạng thái xe và sơ đồ ghế
- Endpoints: GET, POST, PATCH, DELETE `/vehicles`

### 3. [Trip Management](admin-trips.md)
- Quản lý các chuyến đi
- Hủy và hoàn thành chuyến đi
- Endpoints: GET, POST, PATCH, DELETE `/trips`

### 4. [Ticket Management](admin-tickets.md)
- Quản lý vé xe
- Xác nhận, hủy và hoàn tiền vé
- Endpoints: GET, POST, PATCH, DELETE `/tickets`

### 5. [Ticket Request Management](admin-ticket-requests.md)
- Quản lý yêu cầu về vé
- Duyệt, từ chối, xử lý yêu cầu
- Endpoints: GET, POST, PATCH, DELETE `/ticket-requests`

### 6. [Commission Management](admin-commissions.md)
- Quản lý hoa hồng
- Tính toán, duyệt và thanh toán hoa hồng
- Endpoints: GET, POST, PATCH, DELETE `/commissions`

### 7. [Bank Account Management](admin-bank-accounts.md)
- Quản lý tài khoản ngân hàng
- Xác minh và quản lý trạng thái tài khoản
- Endpoints: GET, POST, PATCH, DELETE `/bank-accounts`

### 8. [User Role Management](admin-user-roles.md)
- Quản lý vai trò người dùng
- Phân quyền và kế thừa quyền
- Endpoints: GET, POST, PATCH, DELETE `/user-roles`

---

## Common Response Format

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

## Testing Notes
1. Cần có admin token hợp lệ cho tất cả request
2. Các ObjectId phải là 24 ký tự hex hợp lệ
3. Date format: ISO 8601 (YYYY-MM-DDTHH:mm:ss.sssZ)
4. Tất cả endpoint đều có validation, kiểm tra response khi gửi dữ liệu không hợp lệ 