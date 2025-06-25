# Admin Ticket Management API

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

## TICKET MANAGEMENT

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