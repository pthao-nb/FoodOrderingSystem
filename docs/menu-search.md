# Thực đơn và tìm kiếm

## Chạy thử

- Backend: `dotnet run --project backend/backend.csproj` (http://localhost:7008).
- Frontend: mở terminal trong `frontend`, chạy `npm start` (http://localhost:4200).
- SQL Server sử dụng kết nối hiện có trong `backend/appsettings.json`; không cần đổi cấu trúc 7 bảng.
- Mở `/menu` hoặc nhập từ khóa vào ô tìm kiếm trên header và nhấn Enter.
- Trang `/search?keyword=pho` tìm theo tên món; không phân biệt hoa/thường và dấu tiếng Việt bằng SQL Server collation `Latin1_General_100_CI_AI`.

## Hành vi

- Danh mục lấy từ bảng Loaimonan, món lấy từ Monan.
- Lọc giá: dưới 30.000; từ 30.000 đến dưới 50.000; từ 50.000 đến 100.000; trên 100.000 đồng. Các khoảng không chồng lấn.
- Sắp xếp tên hoặc giá tăng/giảm, phân trang 8 món. Đổi bộ lọc trở về trang 1.
- Điều kiện lọc nằm trong URL, hỗ trợ tải lại, chia sẻ, Back/Forward.
- Trang tìm kiếm khi chưa nhập từ khóa hiển thị hướng dẫn; thực đơn khi không có từ khóa hiển thị tất cả.
- Có trạng thái đang tải, không có kết quả, lỗi kết nối và nút thử lại; ảnh lỗi dùng ảnh thay thế.
- Giao diện đáp ứng màn hình điện thoại, có ô tìm kiếm trong menu di động.
- Thực đơn dùng thẻ ảnh, tên, giá và nút Thêm màu cam; tìm tại đây chỉ tìm tên món, giữ bộ lọc.
- Trang kết quả từ header dùng giao diện riêng: tiêu đề từ khóa, thẻ có mô tả, giá đỏ và nút Thêm vào giỏ màu xanh; không có bộ lọc thực đơn. Chỉ tìm theo tên món.
- Hai nút thêm món gọi POST /api/Cart/items với JWT; chưa đăng nhập chuyển đến /login. API lưu/tăng số lượng trong bảng Giohang hiện có. Trang giỏ hàng đầy đủ chưa được triển khai.
- Trang chi tiết món và điều chỉnh đăng nhập/đăng ký chưa nằm trong phạm vi này.

## API

- `GET /api/Food`: giữ nguyên danh sách cho trang chủ.
- `GET /api/Category`: danh mục (`categoryId`, `categoryName`).
- `GET /api/Food/menu?keyword=pho&sort=price-asc&page=1`: trả về `items`, `totalCount`, `page`, `pageSize`.
- Tham số tùy chọn: `categoryId`, `priceRange` (`all`, `under-30000`, `30000-50000`, `50000-100000`, `over-100000`), `sort` (`default`, `name-asc`, `name-desc`, `price-asc`, `price-desc`).
- Từ khóa tối đa 150 ký tự; page từ 1 đến 1.000.000; tham số sai trả HTTP 400. Trang vượt tổng số trang được đưa về trang cuối.

## Kiểm tra đã thực hiện

- Build Angular production và .NET thành công.
- Kiểm thử API với SQL Server thật: tổng 29 món, mỗi trang 8 món, trang cuối 5 món, từ khóa `pho` trả 2 món phở, lọc giá, lọc danh mục, không có kết quả và HTTP 400 với page=0.
- Backend có cảnh báo sẵn có về nullable trong DTO đăng nhập/đăng ký và dependency System.Security.Cryptography.Pkcs; chưa sửa trong công việc này.

## Kiểm tra phân biệt hai giao diện

- 4 kiểm thử Angular xác nhận thẻ thực đơn không có mô tả, trang tìm kiếm có mô tả và không có bộ lọc, điều kiện tìm kiếm độc lập, và nút thêm ở cả hai trang gọi đúng món.
- API menu nhận searchInDescription (mặc định false); cả thực đơn và trang tìm kiếm từ header gửi false.

## Gợi ý tìm kiếm trên header

- Gõ từ khóa hiển thị tất cả món gợi ý theo tên (có tên và giá), trên cả desktop và điện thoại. Dropdown cao tối đa 3 dòng, cuộn để xem các món còn lại.
- Chờ 250 ms sau khi ngừng gõ mới gọi API; hủy yêu cầu cũ khi đổi từ khóa, xóa ô hoặc đóng dropdown.
- Click gợi ý để mở kết quả cho tên món; hỗ trợ phím mũi tên, Enter và Escape.
- Sau khi gửi tìm kiếm hoặc chuyển trang, ô header được xóa. Điều kiện trang kết quả vẫn nằm trong URL.
- Thực đơn có viền ô tìm màu cam giống danh mục/giá, nút Xóa bộ lọc cạnh nút Tìm đưa mọi điều kiện về mặc định và trang 1.

- GET /api/Food/suggestions?keyword=t trả tất cả gợi ý khớp tên, không phân trang hay cắt bớt; dùng danh sách cuộn 3 dòng.
