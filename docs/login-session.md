# Phiên đăng nhập

- Token và thông tin tài khoản được lưu trong sessionStorage, theo phiên tab, thay cho localStorage.
- Dữ liệu token/user cũ trong localStorage được xóa khi AuthService khởi tạo; không chuyển tự động sang phiên mới.
- Tải lại trang trong cùng tab giữ đăng nhập nếu JWT còn hạn. Đóng tab bình thường kết thúc phiên.
- Khởi động lại localhost khi tab vẫn mở không tự hủy phiên. Trình duyệt có chức năng khôi phục phiên/tab có thể khôi phục cả sessionStorage; đây không phải cơ chế bắt đăng nhập lại sau mọi lần đóng trình duyệt hoặc tắt máy.
- Token lỗi, thiếu thời hạn hoặc hết hạn sẽ bị xóa khi ứng dụng đọc trạng thái đăng nhập. API tiếp tục xác thực JWT ở backend.
- Đăng xuất xóa cả sessionStorage và token/user cũ trong localStorage.
- Không thay đổi mật khẩu, tài khoản hoặc thời hạn JWT trong backend.

Kiểm tra: 7 trường hợp kiểm thử service bao gồm lưu phiên, bỏ dữ liệu cũ, tải lại ứng dụng trong cùng phiên, không có phiên, hết hạn, dữ liệu lỗi và đăng xuất.
