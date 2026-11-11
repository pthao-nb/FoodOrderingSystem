using System.ComponentModel.DataAnnotations;

namespace backend.DTOs.Cart;

public class AddCartItemDto
{
    [Range(1, int.MaxValue)]
    public int FoodId { get; set; }
}
