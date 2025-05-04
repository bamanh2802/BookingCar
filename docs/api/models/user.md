# User Model

Mô hình dữ liệu User đại diện cho người dùng trong hệ thống.

## Cấu trúc

| Trường        | Kiểu     | Mô tả                               |
| ------------- | -------- | ----------------------------------- |
| \_id          | ObjectId | ID duy nhất của người dùng          |
| email         | String   | Email đăng nhập (duy nhất)          |
| password      | String   | Mật khẩu đã được mã hóa             |
| fullName      | String   | Họ và tên đầy đủ                    |
| phone         | String   | Số điện thoại (duy nhất)            |
| roleId        | ObjectId | ID của vai trò người dùng           |
| parentId      | ObjectId | ID của người tạo ra người dùng này  |
| createdBy     | ObjectId | ID của người tạo tài khoản          |
| bankAccountId | ObjectId | ID của tài khoản ngân hàng (nếu có) |
| createdAt     | Date     | Thời gian tạo                       |
| updatedAt     | Date     | Thời gian cập nhật gần nhất         |

## Phân cấp người dùng

Hệ thống sử dụng cấu trúc phân cấp người dùng để kiểm soát việc quản lý tài khoản:

1. **Admin**: Có thể tạo tất cả các loại tài khoản
2. **Đại lý cấp 1**: Có thể tạo Đại lý cấp 2 và Người dùng thông thường
3. **Đại lý cấp 2**: Chỉ có thể tạo Người dùng thông thường
4. **Người dùng (Client)**: Tài khoản cơ bản, không thể tạo tài khoản khác

Mối quan hệ phân cấp này được quản lý thông qua trường `parentId`, cho phép theo dõi ai tạo ra ai.
