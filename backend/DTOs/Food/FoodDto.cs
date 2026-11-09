namespace backend.DTOs.Food
{
    public class FoodDto
    {
        public int FoodId { get; set; }

        public string FoodName { get; set; } = string.Empty;

        public decimal Price { get; set; }

        public decimal? OriginalPrice { get; set; }

        public string? Description { get; set; }

        public string? ImageUrl { get; set; }

        public int? CategoryId { get; set; }

        public string? CategoryName { get; set; }
    }
}