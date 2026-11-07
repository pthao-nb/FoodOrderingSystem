# Food Ordering Website

Website đặt món ăn trực tuyến, cho phép khách hàng xem thực đơn, tìm
kiếm món ăn, quản lý giỏ hàng, đặt món và theo dõi trạng thái đơn hàng.
Quản trị viên có thể quản lý món ăn, danh mục và đơn đặt hàng.

## 1. Công nghệ sử dụng

-   **Frontend:** Angular, TypeScript, HTML, CSS
-   **Backend:** ASP.NET Core Web API, C#, Entity Framework Core
-   **Database:** Microsoft SQL Server

## 2. Cấu trúc thư mục

Dự án được chia thành hai phần chính: frontend và backend.

FoodOrdering/
├── Frontend/
│   ├── public/assets/images/
│   │   ├── foods/
│   │   └── banners/
│   └── src/
│       ├── app/
│       │   ├── core/
│       │   │   ├── services/ 
│       │   │   └── config/
│       │   ├── features/
│       │   │   ├── auth/
│       │   │   │   ├── login/
│       │   │   │   └──register/
│       │   │   └── admin/
│       │   │       ├── dashboard/
│       │   │       ├── food-management/
│       │   │       └── order-management/
│       │   ├── pages/
│       │   │   ├── home/
│       │   │   ├── menu/
│       │   │   ├── food-detail/
│       │   │   ├── search/
│       │   │   ├── cart/
│       │   │   ├── checkout/
│       │   │   ├── orders/
│       │   │   └── order-detail/
│       │   ├── shared/
│       │   │   ├── header/
│       │   │   ├── footer/
│       │   │   └── components/
│       │   ├── app.ts
│       │   ├── app.html
│       │   ├── app.css
│       │   ├── app.routes.ts
│       │   └── app.config.ts
│       ├── styles.css
│       └── index.html
│
└── Backend/
    │
    ├── Controllers/
    │   ├── AuthController.cs
    │   ├── FoodController.cs
    │   ├── CategoryController.cs
    │   ├── CartController.cs
    │   └── OrderController.cs
    │
    ├── DTOs/
    │   ├── Auth/
    │   ├── Food/
    │   ├── Category/
    │   ├── Cart/
    │   └── Order/
    │
    ├── Models/
    │   ├── User.cs
    │   ├── Role.cs
    │   ├── Food.cs
    │   ├── Category.cs
    │   ├── Cart.cs
    │   ├── CartItem.cs
    │   ├── Order.cs
    │   ├── OrderDetail.cs
    │   └── FoodOrderingDbContext.cs
    │
    ├── wwwroot/
    │   └── uploads/
    │       └── foods/
    │
    ├── Properties/
    ├── appsettings.json
    ├── Program.cs
    └── FoodOrdering-Backend.csprojcsproj

> Đây là cấu trúc định hướng ban đầu. Các file và thư mục sẽ được bổ sung trong quá trình triển khai.

## 3. Chức năng chính

### Khách hàng

-   Xem danh sách món ăn và danh mục.
-   Xem thông tin chi tiết món ăn.
-   Tìm kiếm món ăn.
-   Thêm món, cập nhật số lượng và xóa món trong giỏ hàng.
-   Đặt món và tạo đơn hàng.
-   Xem danh sách, chi tiết và trạng thái đơn hàng.

### Quản trị viên

-   Quản lý món ăn: thêm, xem, sửa và xóa.
-   Quản lý danh mục món ăn.
-   Xem và quản lý đơn đặt hàng.
-   Cập nhật trạng thái đơn hàng.

## 4. Trạng thái đơn hàng

Các trạng thái dự kiến:

1.  Chờ xác nhận (`Pending`)
2.  Đã xác nhận (`Confirmed`)
3.  Đang chuẩn bị (`Preparing`)
4.  Đang giao (`Delivering`)
5.  Đã giao (`Delivered`)
6.  Đã hủy (`Cancelled`)

Tên hiển thị và giá trị lưu trong database sẽ được thống nhất khi triển khai.

## 5. Cài đặt và chạy dự án

### Yêu cầu môi trường

-   Node.js và npm.
-   Angular CLI.
-   .NET SDK tương thích với phiên bản ASP.NET Core sử dụng.
-   Microsoft SQL Server.
-   SQL Server Management Studio (SSMS) hoặc công cụ tương đương.

### Chạy Backend

1.  Mở terminal tại thư mục `backend`.
2.  Cấu hình chuỗi kết nối SQL Server trong `appsettings.json`.
3.  Khôi phục package và chạy ứng dụng:

dotnet restore
dotnet run

Địa chỉ API và Swagger (nếu được bật) sẽ hiển thị trong terminal.

### Chạy Frontend

1.  Mở terminal tại thư mục `frontend`.
2.  Cài đặt package:

npm install

3.  Khởi chạy Angular:

ng serve

4.  Truy cập `http://localhost:4200`.

Frontend cần được cấu hình để gọi đúng địa chỉ Backend API.

## 6. Database

Dự án sử dụng Microsoft SQL Server kết hợp Entity Framework Core.

Các bảng dữ liệu dự kiến:

-   `Users`: thông tin tài khoản.
-   `Roles`: vai trò người dùng.
-   `Categories`: danh mục món ăn.
-   `Foods`: thông tin món ăn.
-   `Carts`: giỏ hàng.
-   `CartItems`: các món trong giỏ hàng.
-   `Orders`: thông tin đơn hàng.
-   `OrderDetails`: chi tiết từng món trong đơn hàng.

Cấu trúc bảng, khóa chính, khóa ngoại và quan hệ sẽ được xác định cụ thể trong quá trình thiết kế database.

## 7. Mục tiêu dự án

Xây dựng website đặt món ăn trực tuyến có giao diện thân thiện, chức năng rõ ràng và cấu trúc dễ hiểu, phù hợp với phạm vi đồ án học tập.
