using backend.DTOs.Category;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Services;

public class CategoryService(FoodOrderingDbContext context) : ICategoryService
{
    public Task<List<CategoryDto>> GetCategoriesAsync() => context.Categories
        .AsNoTracking().OrderBy(c => c.CategoryName)
        .Select(c => new CategoryDto(c.CategoryId, c.CategoryName)).ToListAsync();
}
