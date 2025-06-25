# Admin Bank Account Management API

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

## BANK ACCOUNT MANAGEMENT

### Get Bank Account Stats
```
GET /bank-accounts/stats
```

### Get Popular Banks
```
GET /bank-accounts/popular-banks
```

### Get All Bank Accounts
```
GET /bank-accounts
Query Parameters:
- page (number): Trang hiện tại (default: 1)
- limit (number): Số lượng mỗi trang (default: 10)
- userId (string): Lọc theo người dùng
- bankCode (string): Lọc theo mã ngân hàng
- status (string): Lọc theo trạng thái
- isVerified (boolean): Lọc theo xác minh
```

### Create Bank Account
```
POST /bank-accounts
Body:
{
  "userId": "string (required)",
  "bankCode": "string (required)",
  "bankName": "string (required)",
  "accountNumber": "string (required)",
  "accountHolderName": "string (required)",
  "branch": "string",
  "isDefault": "boolean (default: false)",
  "isVerified": "boolean (default: false)",
  "status": "string: active/inactive/blocked"
}
```

### Get Bank Account by ID
```
GET /bank-accounts/:bankAccountId
```

### Update Bank Account
```
PATCH /bank-accounts/:bankAccountId
Body: (tương tự create nhưng tất cả field optional)
```

### Delete Bank Account
```
DELETE /bank-accounts/:bankAccountId
```

### Verify Bank Account
```
PATCH /bank-accounts/:bankAccountId/verify
Body:
{
  "verificationNote": "string"
}
```

### Reject Bank Account
```
PATCH /bank-accounts/:bankAccountId/reject
Body:
{
  "rejectionReason": "string"
}
```

### Toggle Bank Account Status
```
PATCH /bank-accounts/:bankAccountId/toggle-status
Body:
{
  "status": "string (required): active/inactive/blocked"
}
```

### Get Bank Accounts by User
```
GET /bank-accounts/user/:userId
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