using backend.DTOs.Food;

namespace backend.Services
{
    public interface IFoodService
    {
        Task<List<FoodDto>> GetAllFoodsAsync();
        Task<List<FoodDto>> GetSuggestionsAsync(string keyword);
        Task<MenuResult> GetMenuAsync(MenuQuery query);
    }
}