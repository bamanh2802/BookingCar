# BookingCar API Documentation

## Tổng quan

Tài liệu này mô tả các endpoint API cho hệ thống BookingCar.

## Xác thực

Hầu hết các endpoint yêu cầu xác thực bằng Bearer Token. Để lấy token:

1. Gọi endpoint `/user/login` với email và password
2. Lấy `accessToken` từ phản hồi
3. Thêm header `Authorization: Bearer {accessToken}` vào các request

## Định dạng phản hồi

Tất cả các API đều trả về dữ liệu ở định dạng JSON với cấu trúc:

```json
{
  "statusCode": 200, / Mã trạng thái HTTP
  "message": "Success message", / Thông báo
  "data": {} / Dữ liệu trả về
}
```

## Các nhóm API

- [User API](./endpoints/user.md) - Quản lý người dùng
- [Role API](./endpoints/user-role.md) - Quản lý vai trò và quyền hạn
