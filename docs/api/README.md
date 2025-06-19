# BookingCar API Documentation

## 📋 Tổng quan

Tài liệu này cung cấp hướng dẫn đầy đủ cho việc sử dụng API của hệ thống BookingCar.

## 🚀 Base URL

```
Production: https://api.bookingcar.com/api/v1
Development: http://localhost:3017/api/v1
```

## 🔐 Authentication

Hệ thống sử dụng JWT Bearer Token authentication:

```http
Authorization: Bearer <access_token>
```

### Lấy Access Token
1. Gọi `POST /user/login` với email và password
2. Lấy `accessToken` từ response
3. Thêm vào header của các request khác

## 📊 Cấu trúc Response

Tất cả API đều trả về JSON với format:

```json
{
  "statusCode": 200,
  "message": "Success message", 
  "data": {} // Dữ liệu hoặc null
}
```

## 📚 API Groups

### Core APIs
| API Group | Description | Documentation |
|-----------|-------------|---------------|
| **User** | Quản lý người dùng, authentication | [📖 User API](./endpoints/user.md) |
| **Role** | Quản lý vai trò và quyền hạn | [📖 Role API](./endpoints/user-role.md) |
| **Company** | Quản lý công ty vận tải | [📖 Company API](./endpoints/company.md) |
| **Vehicle** | Quản lý xe (mới) | [📖 Vehicle API](./endpoints/vehicle.md) |
| **Trip** | Quản lý chuyến đi | [📖 Trip API](./endpoints/trip.md) |

### Business Logic APIs
| API Group | Description | Endpoints |
|-----------|-------------|-----------|
| **Ticket** | Quản lý vé | 7 endpoints |
| **Ticket Request** | Quản lý yêu cầu vé | 7 endpoints |

## 🗄️ Data Models

| Model | Description | Documentation |
|-------|-------------|---------------|
| **User** | Người dùng hệ thống | [📖 User Model](./models/user.md) |
| **Role** | Vai trò và quyền hạn | [📖 Role Model](./models/role.md) |  
| **Company** | Công ty vận tải | [📖 Company Model](./models/company.md) |
| **Vehicle** | Xe (mới) | [📖 Vehicle Model](./models/vehicle.md) |
| **Trip** | Chuyến đi | [📖 Trip Model](./models/trip.md) |

## 🛡️ Permissions System

### User Roles
- **Admin**: Toàn quyền quản lý hệ thống
- **AgentLv1**: Quản lý AgentLv2 và Client
- **AgentLv2**: Quản lý Client
- **Client**: Người dùng cuối

### Key Permissions
```javascript
// User Management
VIEW_USERS, CREATE_USER, UPDATE_USER, DELETE_USER

// Role Management  
VIEW_ROLES, CREATE_ROLE, UPDATE_ROLE, DELETE_ROLE, MANAGE_ROLE_PERMISSIONS

// Vehicle Management (mới)
VIEW_VEHICLES, CREATE_VEHICLE, UPDATE_VEHICLE, DELETE_VEHICLE, VIEW_DETAIL_VEHICLE

// Trip Management
VIEW_TRIPS, CREATE_TRIP, UPDATE_TRIP, DELETE_TRIP, VIEW_DETAIL_TRIP

// Ticket Management
VIEW_TICKETS, CREATE_TICKET, UPDATE_TICKET, DELETE_TICKET, VIEW_DETAIL_TICKET
```

## 📈 API Statistics

### Total Endpoints: **47 endpoints**

| Category | Count | Admin Only | All Roles |
|----------|-------|------------|-----------|
| User Management | 6 | 4 | 2 |
| Role & Permission | 9 | 9 | 0 |
| Company Management | 5 | 5 | 0 |
| **Vehicle Management** | **8** | **5** | **3** |
| Trip Management | 5 | 3 | 2 |
| Ticket Management | 7 | 4 | 3 |
| Ticket Request | 7 | 3 | 4 |

## 🆕 What's New

### Vehicle Management System
- ✅ **8 new endpoints** for vehicle CRUD operations
- ✅ **Individual seat maps** per vehicle
- ✅ **Status tracking** (active/maintenance/inactive/retired)
- ✅ **Statistics and reporting**
- ✅ **Company-based filtering**

### Enhanced Features
- 🔧 **Improved permissions** system
- 📊 **Better statistics** endpoints
- 🚗 **Fleet management** capabilities
- 🔍 **Advanced filtering** options

## 🛠️ Development

### Environment Setup
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test
```

### API Testing
- Use Postman collection: `BookingCar.postman_collection.json`
- Base URL: `http://localhost:3017/api/v1`
- Required headers: `Authorization: Bearer <token>`

## 🔄 Migration Notes

### From Old System
Khi migrate từ hệ thống cũ:

1. **Vehicle Model**: Tách seatMap từ CarCompany sang Vehicle
2. **New Permissions**: Thêm vehicle permissions vào roles
3. **API Endpoints**: 8 endpoints mới cho vehicle management
4. **Database**: Thêm Vehicle collection với references

### Breaking Changes
- **None**: Tất cả endpoints hiện tại vẫn tương thích
- **Addition Only**: Chỉ thêm mới, không thay đổi existing APIs

## 📞 Support

- **Documentation**: Xem các file markdown trong thư mục này
- **Issues**: Report bugs trong project repository  
- **Questions**: Contact development team

---

**Last Updated**: December 2024  
**API Version**: v1  
**Total Endpoints**: 47 