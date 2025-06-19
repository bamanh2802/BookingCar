# Vehicle API

## Tổng quan

API để quản lý xe (vehicles) trong hệ thống BookingCar. Cho phép admin quản lý danh sách xe của các công ty vận tải.

## Base URL
```
/api/v1/vehicles
```

## Quyền truy cập

- **VIEW_VEHICLES**: Xem danh sách vehicles (Admin, AgentLv1, AgentLv2)
- **VIEW_DETAIL_VEHICLE**: Xem chi tiết vehicle (Admin, AgentLv1, AgentLv2)
- **CREATE_VEHICLE**: Tạo vehicle mới (Admin only)
- **UPDATE_VEHICLE**: Cập nhật vehicle (Admin only)
- **DELETE_VEHICLE**: Xóa vehicle (Admin only)

## Endpoints

### 1. Lấy danh sách vehicles

```http
GET /api/v1/vehicles
```

**Headers:**
```
Authorization: Bearer {accessToken}
```

**Query Parameters:**
- `page` (optional): Số trang, default = 1
- `limit` (optional): Số records per page, default = 10, max = 100
- `companyId` (optional): Filter theo công ty
- `status` (optional): Filter theo trạng thái (active/maintenance/inactive/retired)
- `type` (optional): Filter theo loại xe (bus/coach/limousine/sleeper/minivan)
- `brand` (optional): Filter theo hãng xe

**Response:**
```json
{
  "statusCode": 200,
  "message": "Get vehicles successfully",
  "data": {
    "results": [
      {
        "_id": "64f123...",
        "companyId": {
          "_id": "64f456...",
          "name": "Xe Phương Trang"
        },
        "licensePlate": "29A-12345",
        "specifications": {
          "type": "bus",
          "brand": "Hyundai"
        },
        "status": "active",
        "totalSeats": 45,
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "pagination": {
      "total": 100,
      "page": 1,
      "limit": 10,
      "totalPages": 10
    }
  }
}
```

### 2. Lấy chi tiết vehicle

```http
GET /api/v1/vehicles/{id}
```

**Headers:**
```
Authorization: Bearer {accessToken}
```

**Response:**
```json
{
  "statusCode": 200,
  "message": "Get vehicle details successfully",
  "data": {
    "_id": "64f123...",
    "companyId": {
      "_id": "64f456...",
      "name": "Xe Phương Trang",
      "description": "Công ty vận tải...",
      "hotline": "1900-6067"
    },
    "licensePlate": "29A-12345",
    "specifications": {
      "type": "bus",
      "brand": "Hyundai"
    },
    "status": "active",
    "seatMap": [
      { "code": "A1", "floor": 1 },
      { "code": "A2", "floor": 1 },
      { "code": "B1", "floor": 2 }
    ],
    "totalSeats": 45,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### 3. Tạo vehicle mới

```http
POST /api/v1/vehicles
```

**Headers:**
```
Authorization: Bearer {accessToken}
Content-Type: application/json
```

**Quyền cần thiết:** CREATE_VEHICLE (Admin only)

**Request Body:**
```json
{
  "companyId": "64f456...",
  "licensePlate": "29A-12345",
  "specifications": {
    "type": "bus",
    "brand": "Hyundai"
  },
  "status": "active",
  "seatMap": [
    { "code": "A1", "floor": 1 },
    { "code": "A2", "floor": 1 }
  ]
}
```

**Response:**
```json
{
  "statusCode": 201,
  "message": "Vehicle created successfully",
  "data": {
    "_id": "64f123...",
    "companyId": "64f456...",
    "licensePlate": "29A-12345",
    "specifications": {
      "type": "bus",
      "brand": "Hyundai"
    },
    "status": "active",
    "seatMap": [
      { "code": "A1", "floor": 1 },
      { "code": "A2", "floor": 1 }
    ],
    "totalSeats": 2,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### 4. Cập nhật vehicle

```http
PATCH /api/v1/vehicles/{id}
```

**Headers:**
```
Authorization: Bearer {accessToken}
Content-Type: application/json
```

**Quyền cần thiết:** UPDATE_VEHICLE (Admin only)

**Request Body:** (tất cả fields đều optional)
```json
{
  "licensePlate": "29A-54321",
  "specifications": {
    "type": "coach",
    "brand": "Mercedes"
  },
  "status": "maintenance",
  "seatMap": [
    { "code": "A1", "floor": 1 },
    { "code": "A2", "floor": 1 },
    { "code": "B1", "floor": 2 }
  ]
}
```

**Response:**
```json
{
  "statusCode": 200,
  "message": "Vehicle updated successfully",
  "data": {
    "_id": "64f123...",
    "licensePlate": "29A-54321",
    "specifications": {
      "type": "coach",
      "brand": "Mercedes"
    },
    "status": "maintenance",
    "totalSeats": 3
  }
}
```

### 5. Xóa vehicle

```http
DELETE /api/v1/vehicles/{id}
```

**Headers:**
```
Authorization: Bearer {accessToken}
```

**Quyền cần thiết:** DELETE_VEHICLE (Admin only)

**Response:**
```json
{
  "statusCode": 200,
  "message": "Vehicle deleted successfully",
  "data": null
}
```

### 6. Lấy vehicles đang available

```http
GET /api/v1/vehicles/available
```

**Headers:**
```
Authorization: Bearer {accessToken}
```

**Query Parameters:**
- `companyId` (optional): Filter theo công ty cụ thể

**Response:**
```json
{
  "statusCode": 200,
  "message": "Get available vehicles successfully",
  "data": [
    {
      "_id": "64f123...",
      "companyId": {
        "_id": "64f456...",
        "name": "Xe Phương Trang"
      },
      "licensePlate": "29A-12345",
      "specifications": {
        "type": "bus",
        "brand": "Hyundai"
      },
      "status": "active",
      "totalSeats": 45
    }
  ]
}
```

### 7. Lấy thống kê vehicles

```http
GET /api/v1/vehicles/statistics
```

**Headers:**
```
Authorization: Bearer {accessToken}
```

**Query Parameters:**
- `companyId` (optional): Thống kê theo công ty cụ thể

**Response:**
```json
{
  "statusCode": 200,
  "message": "Get vehicle statistics successfully",
  "data": {
    "total": 150,
    "byStatus": {
      "active": 120,
      "maintenance": 20,
      "inactive": 8,
      "retired": 2
    }
  }
}
```

### 8. Lấy vehicles theo công ty

```http
GET /api/v1/car-companies/{companyId}/vehicles
```

**Headers:**
```
Authorization: Bearer {accessToken}
```

**Query Parameters:**
- `status` (optional): Filter theo trạng thái
- `type` (optional): Filter theo loại xe

**Response:**
```json
{
  "statusCode": 200,
  "message": "Get company vehicles successfully",
  "data": [
    {
      "_id": "64f123...",
      "licensePlate": "29A-12345",
      "specifications": {
        "type": "bus",
        "brand": "Hyundai"
      },
      "status": "active",
      "totalSeats": 45
    }
  ]
}
```

## Validation Rules

### Tạo Vehicle
- `companyId`: Required, valid ObjectId
- `licensePlate`: Required, 5-15 characters, unique toàn hệ thống
- `specifications.type`: Required, enum (bus/coach/limousine/sleeper/minivan)
- `specifications.brand`: Optional, 2-50 characters
- `status`: Optional, enum (active/maintenance/inactive/retired), default = 'active'
- `seatMap`: Optional array of seat objects

### Cập nhật Vehicle
- Tất cả fields đều optional
- `licensePlate`: Nếu có thì phải unique
- Validation rules tương tự create

### Seat Schema
- `code`: Required, max 3 characters
- `floor`: Required, integer >= 1

## Lỗi thường gặp

- **404**: Vehicle không tồn tại
- **404**: Company không tồn tại
- **409**: License plate đã tồn tại
- **422**: Validation errors
- **422**: Duplicate seat codes trong cùng xe
- **403**: Không có quyền thực hiện hành động

## Business Rules

1. **Unique License Plate**: Biển số xe phải unique trong toàn hệ thống
2. **Auto-calculate Total Seats**: Tự động tính totalSeats từ seatMap.length
3. **Company Validation**: Kiểm tra company tồn tại khi tạo vehicle
4. **Seat Code Unique**: Không được trùng mã ghế trong cùng 1 xe
5. **Status Management**: Quản lý trạng thái xe theo lifecycle 