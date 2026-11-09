
using backend.DTOs.Auth;
using backend.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        // API đăng ký tài khoản
        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var result = await _authService.RegisterAsync(dto);

            if (!result.Success)
                return BadRequest(new { message = result.Message });

            return Ok(new { message = result.Message });
        }

        // API đăng nhập
        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var result = await _authService.LoginAsync(dto);

            if (result == null)
                return Unauthorized(new
                {
                    message = "Tài khoản hoặc mật khẩu không chính xác!"
                });

            return Ok(result);
        }

        // API xác nhận tài khoản khi quên mật khẩu
[HttpPost("forgot-password/verify")]
public async Task<IActionResult> VerifyForgotPassword(
    VerifyForgotPasswordDto dto)
{
    if (!ModelState.IsValid)
        return BadRequest(ModelState);

    var result = await _authService.VerifyForgotPasswordAsync(dto);

    if (!result.Success)
        return BadRequest(new { message = result.Message });

    return Ok(new { message = result.Message });
}

// API đặt lại mật khẩu
[HttpPost("forgot-password/reset")]
public async Task<IActionResult> ResetForgotPassword(
    ResetForgotPasswordDto dto)
{
    if (!ModelState.IsValid)
        return BadRequest(ModelState);

    var result = await _authService.ResetForgotPasswordAsync(dto);

    if (!result.Success)
        return BadRequest(new { message = result.Message });

    return Ok(new { message = result.Message });
}

        // API lấy thông tin người dùng đang đăng nhập
        [Authorize]
        [HttpGet("me")]
        public IActionResult GetCurrentUser()
        {
            return Ok(new
            {
                UID = User.FindFirst(ClaimTypes.NameIdentifier)?.Value,
                Taikhoan = User.FindFirst(ClaimTypes.Name)?.Value,
                Role = User.FindFirst(ClaimTypes.Role)?.Value
            });
        }
    }
}
