using System.ComponentModel.DataAnnotations;

namespace backend.DTOs.Food;

public class MenuQuery
{
    [StringLength(150)] public string? Keyword { get; set; }
    public bool SearchInDescription { get; set; } = false;
    [Range(1, int.MaxValue)] public int? CategoryId { get; set; }
    [RegularExpression("^(all|under-30000|30000-50000|50000-100000|over-100000)$")]
    public string PriceRange { get; set; } = "all";
    [RegularExpression("^(default|name-asc|name-desc|price-asc|price-desc)$")]
    public string Sort { get; set; } = "default";
    [Range(1, 1000000)] public int Page { get; set; } = 1;
}

public record MenuResult(List<FoodDto> Items, int TotalCount, int Page, int PageSize);
