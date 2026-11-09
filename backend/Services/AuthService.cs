
using backend.DTOs.Auth;
using backend.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace backend.Services
{
    public class AuthService : IAuthService
    {
        private readonly FoodOrderingDbContext _context;
        private readonly IConfiguration _configuration;

        public AuthService(
            FoodOrderingDbContext context,
            IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        // Đăng ký tài khoản
        public async Task<(bool Success, string Message)> RegisterAsync(RegisterDto dto)
        {
            bool accountExists = await _context.Users
                .AnyAsync(u => u.Taikhoan == dto.Taikhoan);

            if (accountExists)
            {
                return (false, "Tài khoản đã tồn tại!");
            }

            var user = new User
            {
                Hoten = dto.Hoten,
                Taikhoan = dto.Taikhoan,
                Matkhau = BCrypt.Net.BCrypt.HashPassword(dto.Matkhau),
                Email = dto.Email,
                DienthoaiKH = dto.DienthoaiKH,
                DiachiKH = dto.DiachiKH,
                Ngaysinh = dto.Ngaysinh,
                Role = "khach"
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return (true, "Đăng ký tài khoản thành công!");
        }

        // Đăng nhập
        public async Task<AuthResponseDto?> LoginAsync(LoginDto dto)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Taikhoan == dto.Taikhoan);

            if (user == null)
            {
                return null;
            }

            bool passwordValid = BCrypt.Net.BCrypt.Verify(
                dto.Matkhau,
                user.Matkhau
            );

            if (!passwordValid)
            {
                return null;
            }

            string key = _configuration["Jwt:Key"]!;
            string issuer = _configuration["Jwt:Issuer"]!;
            string audience = _configuration["Jwt:Audience"]!;
            int expireMinutes = int.Parse(
                _configuration["Jwt:ExpireMinutes"]!
            );

            var securityKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(key)
            );

            var credentials = new SigningCredentials(
                securityKey,
                SecurityAlgorithms.HmacSha256
            );

            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.UID.ToString()),
                new Claim(ClaimTypes.Name, user.Taikhoan),
                new Claim(ClaimTypes.Role, user.Role)
            };

            var token = new JwtSecurityToken(
                issuer: issuer,
                audience: audience,
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(expireMinutes),
                signingCredentials: credentials
            );

            string tokenString = new JwtSecurityTokenHandler()
                .WriteToken(token);

            return new AuthResponseDto
            {
                UID = user.UID,
                Hoten = user.Hoten,
                Taikhoan = user.Taikhoan,
                Role = user.Role,
                Token = tokenString
            };
        }

        // Xác nhận tài khoản và số điện thoại khi quên mật khẩu
        public async Task<(bool Success, string Message)> VerifyForgotPasswordAsync(
            VerifyForgotPasswordDto dto)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u =>
                u.Taikhoan == dto.Taikhoan.Trim() &&
                u.DienthoaiKH == dto.DienthoaiKH.Trim()
            );

            if (user == null)
            {
                return (false, "Tài khoản hoặc số điện thoại không chính xác!");
            }

            return (true, "Xác nhận thông tin thành công!");
        }

        // Đặt lại mật khẩu
        public async Task<(bool Success, string Message)> ResetForgotPasswordAsync(
            ResetForgotPasswordDto dto)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u =>
                u.Taikhoan == dto.Taikhoan.Trim() &&
                u.DienthoaiKH == dto.DienthoaiKH.Trim()
            );

            if (user == null)
            {
                return (false, "Tài khoản hoặc số điện thoại không chính xác!");
            }

            // Mã hóa mật khẩu mới bằng BCrypt
            user.Matkhau = BCrypt.Net.BCrypt.HashPassword(dto.MatkhauMoi);

            await _context.SaveChangesAsync();

            return (true, "Đổi mật khẩu thành công!");
        }
    }
}
