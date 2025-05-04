# Role Model

Mô hình dữ liệu Role đại diện cho vai trò và quyền hạn trong hệ thống.

## Cấu trúc

| Trường      | Kiểu            | Mô tả                                 |
| ----------- | --------------- | ------------------------------------- |
| \_id        | ObjectId        | ID duy nhất của vai trò               |
| roleName    | String          | Tên vai trò (duy nhất)                |
| permissions | Array<String>   | Danh sách các quyền của vai trò       |
| inherits    | Array<ObjectId> | Danh sách ID các vai trò được kế thừa |
| createdAt   | Date            | Thời gian tạo                         |
| updatedAt   | Date            | Thời gian cập nhật gần nhất           |

## Vai trò mặc định

Hệ thống có 4 vai trò mặc định:

1. **Admin**: Quyền cao nhất, quản lý toàn bộ hệ thống
2. **AgentLv1** (Đại lý cấp 1): Quản lý đại lý cấp 2 và người dùng thông thường
3. **AgentLv2** (Đại lý cấp 2): Quản lý người dùng thông thường
4. **Client** (Người dùng): Vai trò cơ bản

## Cơ chế kế thừa quyền

Vai trò có thể kế thừa quyền từ các vai trò khác thông qua trường `inherits`. Khi một vai trò kế thừa từ vai trò khác, nó sẽ có tất cả các quyền của vai trò đó.

Ví dụ: Nếu một vai trò `CustomRole` kế thừa từ `AgentLv2`, nó sẽ có tất cả các quyền của `AgentLv2` cộng với các quyền riêng của nó.

## Các quyền phổ biến

- `MANAGE_USERS`: Quản lý tất cả người dùng
- `MANAGE_ROLES`: Quản lý vai trò và phân quyền
- `MANAGE_AGENTS_LV1`: Quản lý đại lý cấp 1
- `MANAGE_AGENTS_LV2`: Quản lý đại lý cấp 2
- `MANAGE_CLIENTS`: Quản lý người dùng thông thường
- `VIEW_DASHBOARD`: Xem bảng điều khiển
- `VIEW_REPORTS`: Xem báo cáo
