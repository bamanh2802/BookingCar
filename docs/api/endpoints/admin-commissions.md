# Admin Commission Management API

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

## COMMISSION MANAGEMENT

### Get Commission Stats
```
GET /commissions/stats
Query Parameters:
- startDate (date): Từ ngày
- endDate (date): Đến ngày
- userId (string): Lọc theo người dùng
```

### Calculate All Commissions
```
POST /commissions/calculate
Body:
{
  "startDate": "date (required)",
  "endDate": "date (required)"
}
```

### Get All Commissions
```
GET /commissions
Query Parameters:
- page (number): Trang hiện tại (default: 1)
- limit (number): Số lượng mỗi trang (default: 10)
- search (string): Tìm kiếm
- userId (string): Lọc theo người dùng
- status (string): Lọc theo trạng thái
- startDate (date): Lọc từ ngày
- endDate (date): Lọc đến ngày
```

### Create Commission
```
POST /commissions
Body:
{
  "roleId": "string (required, 24 hex chars)",
  "percent": "number (required, 0-100)"
}
```

### Get Commission by ID
```
GET /commissions/:commissionId
```

### Update Commission
```
PATCH /commissions/:commissionId
Body:
{
  "percent": "number (required, 0-100)"
}
```

### Delete Commission
```
DELETE /commissions/:commissionId
```

### Approve Commission
```
PATCH /commissions/:commissionId/approve
Body:
{
  "approvalNote": "string"
}
```

### Reject Commission
```
PATCH /commissions/:commissionId/reject
Body:
{
  "rejectionReason": "string"
}
```

### Pay Commission
```
PATCH /commissions/:commissionId/pay
Body:
{
  "paymentNote": "string",
  "paymentMethod": "string"
}
```

### Get Commissions by User
```
GET /commissions/user/:userId
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