using backend.DTOs.Category;

namespace backend.Services;

public interface ICategoryService
{
    Task<List<CategoryDto>> GetCategoriesAsync();
}
