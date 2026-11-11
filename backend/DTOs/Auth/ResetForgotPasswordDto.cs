using System.ComponentModel.DataAnnotations;

namespace backend.DTOs.Auth
{
    public class ResetForgotPasswordDto
    {
        [Required(ErrorMessage = "Vui lòng nhập tài khoản!")]
        public string Taikhoan { get; set; } = string.Empty;

        [Required(ErrorMessage = "Vui lòng nhập số điện thoại!")]
        public string DienthoaiKH { get; set; } = string.Empty;

        [Required(ErrorMessage = "Vui lòng nhập mật khẩu mới!")]
        [MinLength(6, ErrorMessage = "Mật khẩu phải có ít nhất 6 ký tự!")]
        public string MatkhauMoi { get; set; } = string.Empty;
    }
}