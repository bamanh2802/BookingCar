# Admin API Endpoints Documentation

## Base URL
```
http://localhost:3000/api/v1/admin
```

## Authentication
Tất cả endpoint admin yêu cầu header:
```
Authorization: Bearer <admin_token>
```

---

## 1. COMPANY MANAGEMENT

### Get All Companies
```
GET /companies
Query Parameters:
- page (number): Trang hiện tại (default: 1)
- limit (number): Số lượng mỗi trang (default: 10)
- search (string): Tìm kiếm theo tên, địa chỉ, số điện thoại
- status (string): Lọc theo trạng thái (active/inactive)
```

### Create Company
```
POST /companies
Body:
{
  "companyName": "string (required)",
  "address": "string (required)",
  "phone": "string (required)",
  "email": "string",
  "website": "string",
  "description": "string",
  "isActive": "boolean (default: true)"
}
```

### Get Company by ID
```
GET /companies/:companyId
```

### Update Company
```
PATCH /companies/:companyIdz
Body: (tương tự create nhưng tất cả field optional)
{
  "companyName": "string",
  "address": "string",
  "phone": "string",
  "email": "string",
  "website": "string",
  "description": "string",
  "isActive": "boolean"
}
```

### Delete Company
```
DELETE /companies/:companyId
```

### Toggle Company Status
```
PATCH /companies/:companyId/toggle-status
Body:
{
  "isActive": "boolean (required)"
}
```

---

## 2. VEHICLE MANAGEMENT

### Get All Vehicles
```
GET /vehicles
Query Parameters:
- page (number): Trang hiện tại (default: 1)
- limit (number): Số lượng mỗi trang (default: 10)
- companyId (string): Lọc theo công ty
- status (string): active, maintenance, inactive, retired
- type (string): bus, coach, limousine, sleeper, minivan
- brand (string): Tìm theo thương hiệu
```

### Create Vehicle
```
POST /vehicles
Body:
{
  "companyId": "string (required)",
  "licensePlate": "string (required, 5-15 chars)",
  "specifications": {
    "type": "string (required): bus/coach/limousine/sleeper/minivan",
    "brand": "string (2-50 chars)"
  },
  "status": "string: active/maintenance/inactive/retired",
  "seatMap": [
    {
      "code": "string (max 3 chars)",
      "floor": "number (min 1)"
    }
  ]
}
```

### Get Vehicle by ID
```
GET /vehicles/:vehicleId
```

### Update Vehicle
```
PATCH /vehicles/:vehicleId
Body: (tương tự create nhưng tất cả field optional)
```

### Delete Vehicle
```
DELETE /vehicles/:vehicleId
```

### Toggle Vehicle Status
```
PATCH /vehicles/:vehicleId/toggle-status
Body:
{
  "status": "string (required): active/maintenance/inactive/retired"
}
```

### Get Vehicles by Company
```
GET /vehicles/company/:companyId
```

---

## 3. TRIP MANAGEMENT

### Get All Trips
```
GET /trips
Query Parameters:
- page (number): Trang hiện tại (default: 1)
- limit (number): Số lượng mỗi trang (default: 10)
- companyId (string): Lọc theo công ty
- vehicleId (string): Lọc theo xe
- status (string): Lọc theo trạng thái
- startDate (date): Lọc từ ngày
- endDate (date): Lọc đến ngày
```

### Create Trip
```
POST /trips
Body:
{
  "companyId": "string (required)",
  "vehicleId": "string (required)",
  "route": {
    "from": "string (required)",
    "to": "string (required)"
  },
  "departureTime": "datetime (required)",
  "arrivalTime": "datetime (required)",
  "price": "number (required)",
  "availableSeats": "number",
  "status": "string: scheduled/in-progress/completed/cancelled"
}
```

### Get Trip by ID
```
GET /trips/:tripId
```

### Update Trip
```
PATCH /trips/:tripId
Body: (tương tự create nhưng tất cả field optional)
```

### Delete Trip
```
DELETE /trips/:tripId
```

### Cancel Trip
```
PATCH /trips/:tripId/cancel
Body:
{
  "cancellationReason": "string"
}
```

### Complete Trip
```
PATCH /trips/:tripId/complete
```

### Get Trips by Company
```
GET /trips/company/:companyId
```

### Get Trips by Vehicle
```
GET /trips/vehicle/:vehicleId
```

---

## 4. TICKET MANAGEMENT

### Get All Tickets
```
GET /tickets
Query Parameters:
- page (number): Trang hiện tại (default: 1)
- limit (number): Số lượng mỗi trang (default: 10)
- tripId (string): Lọc theo chuyến đi
- userId (string): Lọc theo người dùng
- status (string): Lọc theo trạng thái
- startDate (date): Lọc từ ngày
- endDate (date): Lọc đến ngày
```

### Create Ticket
```
POST /tickets
Body:
{
  "tripId": "string (required)",
  "userId": "string (required)",
  "seatNumber": "string (required)",
  "passengerInfo": {
    "name": "string (required)",
    "phone": "string (required)",
    "email": "string"
  },
  "price": "number (required)",
  "status": "string: pending/confirmed/cancelled/refunded"
}
```

### Get Ticket by ID
```
GET /tickets/:ticketId
```

### Update Ticket
```
PATCH /tickets/:ticketId
Body: (tương tự create nhưng tất cả field optional)
```

### Delete Ticket
```
DELETE /tickets/:ticketId
```

### Confirm Ticket
```
PATCH /tickets/:ticketId/confirm
```

### Cancel Ticket
```
PATCH /tickets/:ticketId/cancel
Body:
{
  "cancellationReason": "string"
}
```

### Refund Ticket
```
PATCH /tickets/:ticketId/refund
Body:
{
  "refundReason": "string",
  "refundAmount": "number"
}
```

### Get Tickets by Trip
```
GET /tickets/trip/:tripId
```

### Get Tickets by User
```
GET /tickets/user/:userId
```

---

## 5. TICKET REQUEST MANAGEMENT

### Get Ticket Request Stats
```
GET /ticket-requests/stats
Query Parameters:
- startDate (date): Từ ngày
- endDate (date): Đến ngày
- status (string): Lọc theo trạng thái
```

### Get All Ticket Requests
```
GET /ticket-requests
Query Parameters:
- page (number): Trang hiện tại (default: 1)
- limit (number): Số lượng mỗi trang (default: 10)
- userId (string): Lọc theo người dùng
- status (string): pending/approved/rejected/processing/completed
- startDate (date): Lọc từ ngày
- endDate (date): Lọc đến ngày
```

### Create Ticket Request
```
POST /ticket-requests
Body:
{
  "userId": "string (required)",
  "tripId": "string (required)",
  "requestType": "string (required): booking/cancellation/change",
  "details": "object (required)",
  "priority": "string: low/medium/high",
  "status": "string: pending/approved/rejected/processing/completed"
}
```

### Get Ticket Request by ID
```
GET /ticket-requests/:requestId
```

### Update Ticket Request
```
PATCH /ticket-requests/:requestId
Body: (tương tự create nhưng tất cả field optional)
```

### Delete Ticket Request
```
DELETE /ticket-requests/:requestId
```

### Approve Ticket Request
```
PATCH /ticket-requests/:requestId/approve
Body:
{
  "approvalNote": "string"
}
```

### Reject Ticket Request
```
PATCH /ticket-requests/:requestId/reject
Body:
{
  "rejectionReason": "string (required)"
}
```

### Process Ticket Request
```
PATCH /ticket-requests/:requestId/process
Body:
{
  "processNote": "string"
}
```

### Complete Ticket Request
```
PATCH /ticket-requests/:requestId/complete
Body:
{
  "completionNote": "string"
}
```

### Get Ticket Requests by User
```
GET /ticket-requests/user/:userId
```

---

## 6. COMMISSION MANAGEMENT

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

---

## 7. BANK ACCOUNT MANAGEMENT

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

---

## 8. USER ROLE MANAGEMENT

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