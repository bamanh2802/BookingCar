# CarCompany Model

Mô hình dữ liệu `CarCompany` đại diện cho thông tin các nhà xe trong hệ thống, bao gồm loại xe, sơ đồ ghế và thông tin liên hệ.

---

## Cấu trúc

| Trường      | Kiểu     | Mô tả                                                       |
| ----------- | -------- | ----------------------------------------------------------- |
| \_id        | ObjectId | ID duy nhất của nhà xe                                      |
| name        | String   | Tên nhà xe, bắt buộc, độ dài tối thiểu/tối đa theo cấu hình |
| description | String   | Mô tả nhà xe, tối đa 500 ký tự                              |
| hotline     | String   | Số điện thoại liên hệ, định dạng hợp lệ và bắt buộc         |
| type        | String   | Loại xe (`VIP` hoặc `REGULAR`), bắt buộc                    |
| totalSeats  | Number   | Tổng số ghế, tự động tính từ `seatMap`, không âm            |
| seatMap     | Array    | Danh sách các ghế, gồm `code` và `floor`                    |
| createdAt   | Date     | Thời điểm tạo bản ghi, tự động sinh                         |
| updatedAt   | Date     | Thời điểm cập nhật gần nhất, tự động sinh                   |

---

## Cấu trúc trường `seatMap`

Mỗi phần tử trong mảng `seatMap` đại diện cho một ghế trên xe với cấu trúc sau:

| Trường  | Kiểu   | Mô tả                                |
| ------- | ------ | ------------------------------------ |
| `code`  | String | Mã ghế (tối đa 3 ký tự), bắt buộc    |
| `floor` | Number | Số tầng của ghế (1 hoặc 2), bắt buộc |

> **Ghi chú**: `seatMap` không sinh `_id` riêng cho từng ghế.

---

## Middleware đặc biệt

- **Tự động tính `totalSeats`**:  
  Trước khi validate và lưu vào cơ sở dữ liệu, schema sẽ đếm số lượng phần tử trong `seatMap` và cập nhật vào trường `totalSeats`.

---

## Ràng buộc & xác thực

- `name`: phải có, độ dài giới hạn theo `VALIDATION_RULES`.
- `hotline`: bắt buộc, đúng định dạng theo `VALIDATION_RULES.PHONE_NUMBER_RULE`.
- `type`: chỉ chấp nhận giá trị `VIP` hoặc `REGULAR`.
- `seatMap`: mảng các ghế, nếu có thay đổi sẽ tự cập nhật `totalSeats`.

---

## Enum hỗ trợ

| Enum        | Giá trị khả dụng |
| ----------- | ---------------- |
| `CAR_TYPES` | `VIP`, `REGULAR` |

---

## Timestamps

- `createdAt` và `updatedAt` được tự động thêm bởi tùy chọn `timestamps: true` trong schema.
