
using System.ComponentModel.DataAnnotations;

namespace backend.DTOs.Auth
{
    public class LoginDto
    {
        [Required(ErrorMessage = "Vui lòng nhập tài khoản")]
        public string Taikhoan { get; set; }

        [Required(ErrorMessage = "Vui lòng nhập mật khẩu")]
        public string Matkhau { get; set; }
    }
}
