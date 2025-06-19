# Vehicle Model

Mô hình dữ liệu Vehicle đại diện cho thông tin xe trong hệ thống BookingCar. Mỗi xe thuộc về một công ty và có sơ đồ ghế riêng.

---

## Cấu trúc

| Trường        | Kiểu     | Mô tả                                        |
| ------------- | -------- | -------------------------------------------- |
| \_id          | ObjectId | ID duy nhất của xe                           |
| companyId     | ObjectId | ID của công ty sở hữu xe (tham chiếu CarCompany) |
| licensePlate  | String   | Biển số xe (duy nhất trong toàn hệ thống)    |
| specifications| Object   | Thông số kỹ thuật của xe                     |
| status        | String   | Trạng thái hoạt động của xe                  |
| seatMap       | Array    | Danh sách các ghế trên xe                    |
| totalSeats    | Number   | Tổng số ghế (tự động tính từ seatMap)        |
| createdAt     | Date     | Thời gian tạo                                |
| updatedAt     | Date     | Thời gian cập nhật gần nhất                  |

---

## Cấu trúc trường `specifications`

| Trường | Kiểu   | Mô tả                                      |
| ------ | ------ | ------------------------------------------ |
| type   | String | Loại xe (bus/coach/limousine/sleeper/minivan) |
| brand  | String | Hãng xe (Toyota, Hyundai, Mercedes...)     |

---

## Cấu trúc trường `seatMap`

Mỗi phần tử trong mảng `seatMap` đại diện cho một ghế trên xe:

| Trường | Kiểu   | Mô tả                                |
| ------ | ------ | ------------------------------------ |
| code   | String | Mã ghế (tối đa 3 ký tự), bắt buộc    |
| floor  | Number | Số tầng của ghế (≥ 1), bắt buộc      |

> **Ghi chú**: `seatMap` không sinh `_id` riêng cho từng ghế.

---

## Trạng thái xe

| Trạng thái    | Mô tả                      |
| ------------- | -------------------------- |
| `active`      | Đang hoạt động             |
| `maintenance` | Đang bảo trì               |
| `inactive`    | Tạm ngưng hoạt động        |
| `retired`     | Đã nghỉ hoạt động          |

---

## Loại xe hỗ trợ

| Loại        | Mô tả              |
| ----------- | ------------------ |
| `bus`       | Xe buýt            |
| `coach`     | Xe khách cao cấp   |
| `limousine` | Xe limousine       |
| `sleeper`   | Xe giường nằm      |
| `minivan`   | Xe van             |

---

## Middleware đặc biệt

- **Tự động tính `totalSeats`**:  
  Trước khi validate và lưu vào cơ sở dữ liệu, schema sẽ đếm số lượng phần tử trong `seatMap` và cập nhật vào trường `totalSeats`.

---

## Ràng buộc & xác thực

- `companyId`: bắt buộc, phải tồn tại trong CarCompany collection
- `licensePlate`: bắt buộc, 5-15 ký tự, duy nhất trong toàn hệ thống
- `specifications.type`: bắt buộc, chỉ chấp nhận các giá trị enum
- `specifications.brand`: tùy chọn, 2-50 ký tự nếu có
- `status`: mặc định là 'active'
- `seatMap`: mảng các ghế, không được trùng mã ghế trong cùng xe

---

## Mối quan hệ

- **Vehicle → CarCompany**: Nhiều xe thuộc về một công ty (Many-to-One)
- **Vehicle ← Trip**: Một xe có thể được gán cho nhiều chuyến đi theo thời gian (One-to-Many - future)

---

## Timestamps

- `createdAt` và `updatedAt` được tự động thêm bởi tùy chọn `timestamps: true` trong schema.

---

## Ví dụ tài liệu

### Xe buýt thông thường
```json
{
  "_id": "64f123456789abcdef123456",
  "companyId": "64f789abcdef123456789abc",
  "licensePlate": "29A-12345",
  "specifications": {
    "type": "bus",
    "brand": "Hyundai"
  },
  "status": "active",
  "seatMap": [
    { "code": "A1", "floor": 1 },
    { "code": "A2", "floor": 1 },
    { "code": "B1", "floor": 1 }
  ],
  "totalSeats": 3
}
```

### Xe giường nằm
```json
{
  "_id": "64f123456789abcdef123457",
  "companyId": "64f789abcdef123456789abc", 
  "licensePlate": "51G-67890",
  "specifications": {
    "type": "sleeper",
    "brand": "Mercedes"
  },
  "status": "maintenance",
  "seatMap": [
    { "code": "L1", "floor": 1 },
    { "code": "U1", "floor": 2 }
  ],
  "totalSeats": 2
}
```

 