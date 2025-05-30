# Trip Model

Mô hình dữ liệu Trip đại diện cho chuyến đi trong hệ thống.

## Cấu trúc

| Trường         | Kiểu     | Mô tả                                 |
| -------------- | -------- | ------------------------------------- |
| \_id           | ObjectId | ID duy nhất của chuyến đi             |
| startLocation  | String   | Điểm xuất phát                        |
| endLocation    | String   | Điểm kết thúc                         |
| startStation   | String   | Bến xe xuất phát                      |
| endStation     | String   | Bến xe kết thúc                       |
| startTime      | Date     | Thời gian khởi hành                   |
| endTime        | Date     | Thời gian kết thúc                    |
| carCompanyId   | ObjectId | ID của nhà xe (tham chiếu CarCompany) |
| seatMapId      | ObjectId | ID sơ đồ ghế (tham chiếu SeatMap)     |
| price          | Number   | Giá vé cho chuyến đi                  |
| availableSeats | Number   | Số ghế còn trống                      |
| totalSeats     | Number   | Tổng số ghế trên xe                   |
| createdAt      | Date     | Thời gian tạo                         |
| updatedAt      | Date     | Thời gian cập nhật gần nhất           |

## Ghi chú

- Trường `carCompanyId` liên kết với nhà xe cung cấp chuyến đi.
- Trường `seatMapId` liên kết với sơ đồ ghế của xe.
- Trường `availableSeats` sẽ tự động cập nhật khi có khách đặt vé.
- Hàm `updateAvailableSeats(seatsBooked)` dùng để cập nhật số ghế còn lại khi có khách đặt vé. Nếu số ghế đặt vượt quá số ghế còn lại, sẽ trả về lỗi.
- Các trường thời gian (`startTime`, `endTime`, `createdAt`, `updatedAt`) đều ở định dạng ngày giờ chuẩn ISO.
