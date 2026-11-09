using backend.DTOs.Auth;

namespace backend.Services
{
    public interface IAuthService
    {
        Task<(bool Success, string Message)> RegisterAsync(RegisterDto dto);

        Task<AuthResponseDto?> LoginAsync(LoginDto dto);
        
        Task<(bool Success, string Message)> VerifyForgotPasswordAsync(
    VerifyForgotPasswordDto dto
);

Task<(bool Success, string Message)> ResetForgotPasswordAsync(
    ResetForgotPasswordDto dto
);
    }
}