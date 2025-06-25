# Admin Ticket Request Management API

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

## TICKET REQUEST MANAGEMENT

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