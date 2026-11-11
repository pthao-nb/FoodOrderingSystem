using backend.DTOs.Cart;
using backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace backend.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class CartController(ICartService cartService) : ControllerBase
{
    [HttpPost("items")]
    public async Task<IActionResult> AddItem(AddCartItemDto dto)
    {
        if (!int.TryParse(User.FindFirstValue(ClaimTypes.NameIdentifier), out var userId))
            return Unauthorized();
        if (!await cartService.AddItemAsync(userId, dto.FoodId))
            return NotFound(new { message = "Không tìm thấy món ăn hoặc tài khoản." });
        return Ok(new { message = "Đã thêm món vào giỏ hàng." });
    }
}
