# Trip API

## Tạo chuyến đi mới

**Endpoint:** `POST /trip`

**Authentication:** Bearer Token

**Quyền cần thiết:** `MANAGE_ROUTES`

**Request Body:**

```json
{
  "startLocation": "Hà Nội",
  "endLocation": "Hải Phòng",
  "startStation": "Bến xe Mỹ Đình",
  "endStation": "Bến xe Niệm Nghĩa",
  "startTime": "2025-06-01T08:00:00.000Z",
  "endTime": "2025-06-01T10:30:00.000Z",
  "carCompanyId": "6657abcdef1234567890abcd",
  "price": 150000
}
```

**Response (201):**

```json
{
  "statusCode": 201,
  "message": "Tạo chuyến đi thành công",
  "data": {
    "_id": "6657abcdef1234567890abcf",
    "startLocation": "Hà Nội",
    "endLocation": "Hải Phòng",
    "startStation": "Bến xe Mỹ Đình",
    "endStation": "Bến xe Niệm Nghĩa",
    "startTime": "2025-06-01T08:00:00.000Z",
    "endTime": "2025-06-01T10:30:00.000Z",
    "carCompanyId": "6657abcdef1234567890abcd",
    "seatMapId": "6657abcdef1234567890abce",
    "price": 150000,
    "availableSeats": 40,
    "totalSeats": 40,
    "createdAt": "2025-05-30T12:00:00.000Z",
    "updatedAt": "2025-05-30T12:00:00.000Z"
  }
}
```

## Lấy danh sách chuyến đi

**Endpoint:** `GET /trip`

**Authentication:** Bearer Token

**Quyền cần thiết:** `ADMIN`

**Query Parameters:**

- `page`: Trang (mặc định 1)
- `limit`: Số lượng kết quả mỗi trang (mặc định 10)
- `startTime`: Lọc theo ngày khởi hành

**Response (200):**

```json
{
  "statusCode": 200,
  "message": "Lấy danh sách chuyến đi thành công",
  "data": {
    "results": [
      {
        "_id": "6657abcdef1234567890abcf",
        "startLocation": "Hà Nội",
        "endLocation": "Hải Phòng",
        "startStation": "Bến xe Mỹ Đình",
        "endStation": "Bến xe Niệm Nghĩa",
        "startTime": "2025-06-01T08:00:00.000Z",
        "endTime": "2025-06-01T10:30:00.000Z",
        "carCompanyId": "6657abcdef1234567890abcd",
        "seatMapId": "6657abcdef1234567890abce",
        "price": 150000,
        "availableSeats": 40,
        "totalSeats": 40
      }
      // ...các chuyến đi khác
    ],
    "pagination": {
      "total": 25,
      "page": 1,
      "limit": 10,
      "totalPages": 3
    }
  }
}
```

## Lấy thông tin chuyến đi theo ID

**Endpoint:** `GET /trip/:tripId`

**Authentication:** Bearer Token

**Response (200):**

```json
{
  "statusCode": 200,
  "message": "Lấy thông tin chuyến đi thành công",
  "data": {
    "_id": "6657abcdef1234567890abcf",
    "startLocation": "Hà Nội",
    "endLocation": "Hải Phòng",
    "startStation": "Bến xe Mỹ Đình",
    "endStation": "Bến xe Niệm Nghĩa",
    "startTime": "2025-06-01T08:00:00.000Z",
    "endTime": "2025-06-01T10:30:00.000Z",
    "carCompanyId": "6657abcdef1234567890abcd",
    "seatMapId": "6657abcdef1234567890abce",
    "price": 150000,
    "availableSeats": 40,
    "totalSeats": 40,
    "createdAt": "2025-05-30T12:00:00.000Z",
    "updatedAt": "2025-05-30T12:00:00.000Z"
  }
}
```

## Cập nhật chuyến đi

**Endpoint:** `PATCH /trip/:tripId`

**Authentication:** Bearer Token

**Quyền cần thiết:** `MANAGE_ROUTES`

**Request Body:**

```json
{
  "price": 180000
}
```

**Response (200):**

```json
{
  "statusCode": 200,
  "message": "Cập nhật chuyến đi thành công",
  "data": {
    "_id": "6657abcdef1234567890abcf",
    "startLocation": "Hà Nội",
    "endLocation": "Hải Phòng",
    "startStation": "Bến xe Mỹ Đình",
    "endStation": "Bến xe Niệm Nghĩa",
    "startTime": "2025-06-01T08:00:00.000Z",
    "endTime": "2025-06-01T10:30:00.000Z",
    "carCompanyId": "6657abcdef1234567890abcd",
    "seatMapId": "6657abcdef1234567890abce",
    "price": 180000,
    "availableSeats": 40,
    "totalSeats": 40,
    "createdAt": "2025-05-30T12:00:00.000Z",
    "updatedAt": "2025-05-30T12:10:00.000Z"
  }
}
```

## Xóa chuyến đi

**Endpoint:** `DELETE /trip/:tripId`

**Authentication:** Bearer Token

**Quyền cần thiết:** `MANAGE_ROUTES`

**Response (200):**

```json
{
  "statusCode": 200,
  "message": "Xóa chuyến đi thành công"
}
```
