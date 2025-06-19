# Trip API

## Tổng quan

API để quản lý chuyến đi trong hệ thống BookingCar. Cho phép tạo, cập nhật và quản lý các chuyến xe.

## Base URL
```
/api/v1/trips
```

## Quyền truy cập

- **VIEW_TRIPS**: Xem danh sách chuyến đi (All roles)
- **VIEW_DETAIL_TRIP**: Xem chi tiết chuyến đi (All roles) 
- **CREATE_TRIP**: Tạo chuyến đi mới (Admin only)
- **UPDATE_TRIP**: Cập nhật chuyến đi (Admin only)
- **DELETE_TRIP**: Xóa chuyến đi (Admin only)

## Endpoints

### 1. Lấy danh sách chuyến đi

```http
GET /api/v1/trips
```

**Headers:**
```
Authorization: Bearer {accessToken}
```

**Response:**
```json
{
  "statusCode": 200,
  "message": "Get trips successfully", 
  "data": [
    {
      "_id": "64f123...",
      "startLocation": "Hồ Chí Minh",
      "endLocation": "Đà Lạt",
      "startStation": "Bến xe Miền Đông",
      "endStation": "Bến xe Đà Lạt",
      "startTime": "2024-01-15T08:00:00.000Z",
      "endTime": "2024-01-15T14:00:00.000Z",
      "price": 250000,
      "carCompanyId": {
        "_id": "64f456...",
        "name": "Xe Phương Trang"
      },
      "totalSeats": 45,
      "availableSeats": 30
    }
  ]
}
```

### 2. Lấy chi tiết chuyến đi

```http
GET /api/v1/trips/{tripId}
```

**Headers:**
```
Authorization: Bearer {accessToken}
```

**Quyền cần thiết:** VIEW_DETAIL_TRIP

**Response:**
```json
{
  "statusCode": 200,
  "message": "Get trip details successfully",
  "data": {
    "_id": "64f123...",
    "startLocation": "Hồ Chí Minh", 
    "endLocation": "Đà Lạt",
    "startStation": "Bến xe Miền Đông",
    "endStation": "Bến xe Đà Lạt",
    "startTime": "2024-01-15T08:00:00.000Z",
    "endTime": "2024-01-15T14:00:00.000Z",
    "price": 250000,
    "carCompanyId": "64f456...",
    "totalSeats": 45,
    "availableSeats": 30,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### 3. Tạo chuyến đi mới

```http
POST /api/v1/trips
```

**Headers:**
```
Authorization: Bearer {accessToken}
Content-Type: application/json
```

**Quyền cần thiết:** CREATE_TRIP (Admin only)

**Request Body:**
```json
{
  "startLocation": "Hồ Chí Minh",
  "endLocation": "Đà Lạt", 
  "startStation": "Bến xe Miền Đông",
  "endStation": "Bến xe Đà Lạt",
  "startTime": "2024-01-15T08:00:00.000Z",
  "endTime": "2024-01-15T14:00:00.000Z",
  "price": 250000,
  "carCompanyId": "64f456...",
  "totalSeats": 45
}
```

**Response:**
```json
{
  "statusCode": 201,
  "message": "Trip created successfully",
  "data": {
    "_id": "64f123...",
    "startLocation": "Hồ Chí Minh",
    "endLocation": "Đà Lạt",
    "startStation": "Bến xe Miền Đông", 
    "endStation": "Bến xe Đà Lạt",
    "startTime": "2024-01-15T08:00:00.000Z",
    "endTime": "2024-01-15T14:00:00.000Z",
    "price": 250000,
    "carCompanyId": "64f456...",
    "totalSeats": 45,
    "availableSeats": 45,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### 4. Cập nhật chuyến đi

```http
PATCH /api/v1/trips/{tripId}
```

**Headers:**
```
Authorization: Bearer {accessToken}
Content-Type: application/json
```

**Quyền cần thiết:** UPDATE_TRIP (Admin only)

**Request Body:** (tất cả fields đều optional)
```json
{
  "startTime": "2024-01-15T09:00:00.000Z",
  "endTime": "2024-01-15T15:00:00.000Z", 
  "price": 280000
}
```

**Response:**
```json
{
  "statusCode": 200,
  "message": "Trip updated successfully",
  "data": {
    "_id": "64f123...",
    "startTime": "2024-01-15T09:00:00.000Z",
    "endTime": "2024-01-15T15:00:00.000Z",
    "price": 280000
  }
}
```

### 5. Xóa chuyến đi

```http
DELETE /api/v1/trips/{tripId}
```

**Headers:**
```
Authorization: Bearer {accessToken}
```

**Quyền cần thiết:** DELETE_TRIP (Admin only)

**Response:**
```json
{
  "statusCode": 200,
  "message": "Trip deleted successfully",
  "data": null
}
```

## Validation Rules

### Tạo Trip
- `startLocation`: Required, string
- `endLocation`: Required, string
- `startStation`: Required, string  
- `endStation`: Required, string
- `startTime`: Required, valid date (future)
- `endTime`: Required, valid date (after startTime)
- `price`: Required, number > 0
- `carCompanyId`: Required, valid ObjectId
- `totalSeats`: Required, number > 0

### Cập nhật Trip
- Tất cả fields đều optional
- `startTime/endTime`: Phải là valid dates và logical
- `price`: Phải > 0 nếu có
- `totalSeats`: Phải >= số ghế đã đặt

## Lỗi thường gặp

- **404**: Trip không tồn tại
- **404**: CarCompany không tồn tại  
- **422**: Validation errors
- **400**: startTime >= endTime
- **400**: Không thể cập nhật trip đã bắt đầu
- **403**: Không có quyền thực hiện hành động

## Business Rules

1. **Time Validation**: startTime phải < endTime
2. **Future Trips**: Chỉ có thể tạo trip trong tương lai
3. **Seat Management**: totalSeats >= availableSeats
4. **Company Reference**: carCompanyId phải tồn tại
5. **Update Restrictions**: Không được update trip đã bắt đầu
