namespace backend.Services;

public interface ICartService
{
    Task<bool> AddItemAsync(int userId, int foodId);
}
