
namespace backend.DTOs.Auth
{
    public class AuthResponseDto
    {
        public int UID { get; set; }

        public string Hoten { get; set; }

        public string Taikhoan { get; set; }

        public string Role { get; set; }

        public string Token { get; set; }
    }
}
