# Admin Vehicle Management API

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

## VEHICLE MANAGEMENT

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