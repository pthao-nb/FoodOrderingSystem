using backend.DTOs.Food;

namespace backend.Services
{
    public interface IFoodService
    {
        Task<List<FoodDto>> GetAllFoodsAsync();
    }
}