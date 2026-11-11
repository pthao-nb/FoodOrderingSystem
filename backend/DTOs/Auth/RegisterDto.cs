
using System.ComponentModel.DataAnnotations;

namespace backend.DTOs.Auth
{
    public class RegisterDto
    {
        [Required(ErrorMessage = "Họ tên không được để trống")]
        public string Hoten { get; set; }

        [Required(ErrorMessage = "Tài khoản không được để trống")]
        public string Taikhoan { get; set; }

        [Required(ErrorMessage = "Mật khẩu không được để trống")]
        [MinLength(6, ErrorMessage = "Mật khẩu phải có ít nhất 6 ký tự")]
        public string Matkhau { get; set; }

        [EmailAddress(ErrorMessage = "Email không hợp lệ")]
        public string? Email { get; set; }

        public string? DienthoaiKH { get; set; }

        public string? DiachiKH { get; set; }

        public DateTime? Ngaysinh { get; set; }
    }
}
