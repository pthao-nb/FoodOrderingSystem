using System.ComponentModel.DataAnnotations;

namespace backend.DTOs.Auth
{
    public class VerifyForgotPasswordDto
    {
        [Required(ErrorMessage = "Vui lòng nhập tài khoản!")]
        public string Taikhoan { get; set; } = string.Empty;

        [Required(ErrorMessage = "Vui lòng nhập số điện thoại!")]
        public string DienthoaiKH { get; set; } = string.Empty;
    }
}