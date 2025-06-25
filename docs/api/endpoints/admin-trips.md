# Admin Trip Management API

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

## TRIP MANAGEMENT

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