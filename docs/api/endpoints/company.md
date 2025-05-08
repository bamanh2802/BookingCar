# Company API

** Đăng ký công ty
**Endpoint:\*\* `POST /companies/`

**Authentication:** Cookie/ Bearer Token
**Role:** Admin
**Response:** 201 Created

```json
{
  "statusCode": 201,
  "success": true,
  "message": "Tạo công ty xe thành công",
  "data": {
    "name": "Phuc Loi",
    "description": "Đóm con",
    "hotline": "0866563332",
    "type": "Regular",
    "totalSeats": 3,
    "seatMap": [
      {
        "code": "A1",
        "floor": 1
      },
      {
        "code": "B1",
        "floor": 1
      },
      {
        "code": "C1",
        "floor": 1
      }
    ],
    "_id": "681c8890f8a1b09eba135bb6",
    "createdAt": "2025-05-08T10:33:52.298Z",
    "updatedAt": "2025-05-08T10:33:52.298Z"
  }
}
```

## Lấy danh sách công ty

**Endpoint:** `GET /companies/`
**Authentication:** Cookie/ Bearer Token
**Role:** Admin
**Response:** 200 OK

```json
{
  "statusCode": 200,
  "success": true,
  "message": "Lấy danh sách công ty xe thành công",
  "data": {
    "results": [
      {
        "_id": "6818aa28af0a7240bdce8d8f",
        "name": "VAN MINH21",
        "description": "Đóm con",
        "hotline": "0866563384",
        "type": "Regular",
        "totalSeats": 2,
        "seatMap": [
          {
            "code": "A1",
            "floor": 1,
            "_id": "6818aa28af0a7240bdce8d90"
          }
        ],
        "createdAt": "2025-05-05T12:08:08.550Z",
        "updatedAt": "2025-05-05T12:08:08.550Z"
      }
      // ... other companies
    ],
    "pagination": {
      "total": 13,
      "page": "2",
      "limit": "10",
      "totalPages": 2
    }
  }
}
```

## Lấy thông tin chi tiết công ty

**Endpoint:** `GET /companies/:companyId`
**Authentication:** Cookie/ Bearer Token
**Role:** Admin
**Response:** 200 OK

```json
{
  "statusCode": 200,
  "success": true,
  "message": "Lấy thông tin công ty xe thành công",
  "data": {
    "_id": "6818aa28af0a7240bdce8d8f",
    "name": "VAN MINH21",
    "description": "Đóm con",
    "hotline": "0866563384",
    "type": "Regular",
    "totalSeats": 2,
    "seatMap": [
      {
        "_id": "6818aa28af0a7240bdce8d90",
        "code": "A1",
        "floor": 1
      }
    ],
    "createdAt": "2025-05-05T12:08:08.550Z",
    "updatedAt": "2025-05-05T12:08:08.550Z"
  }
}
```

## Cập nhật thông tin công ty

**Endpoint:** `PATCH /companies/:companyId`
**Authentication:** Cookie/ Bearer Token
**Role:** Admin
**Response:** 200 OK

```json
{
  "statusCode": 200,
  "success": true,
  "message": "Cập nhật thông tin công ty xe thành công",
  "data": {
    "_id": "6818aa28af0a7240bdce8d8f",
    "name": "VAN MINH21",
    "description": "Đóm con",
    "hotline": "0866563384",
    "type": "Regular",
    "totalSeats": 2,
    "seatMap": [
      {
        "_id": "6818aa28af0a7240bdce8d90",
        "code": "A1",
        "floor": 1
      }
    ],
    "createdAt": "2025-05-05T12:08:08.550Z",
    "updatedAt": "2025-05-05T12:08:08.550Z"
  }
}
```

## Xóa công ty

**Endpoint:** `DELETE /companies/:companyId`
**Authentication:** Cookie/ Bearer Token
**Role:** Admin
**Response:** 200 OK

```json
{
  "statusCode": 200,
  "success": true,
  "message": "Thực hiện thành công",
  "data": {
    "message": "Xóa công ty xe thành công"
  }
}
```
