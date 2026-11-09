
using backend.DTOs.Food;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Services
{
    public class FoodService : IFoodService
    {
        private readonly FoodOrderingDbContext _context;

        public FoodService(FoodOrderingDbContext context)
        {
            _context = context;
        }

        public async Task<List<FoodDto>> GetAllFoodsAsync()
        {
            return await _context.Foods
                .AsNoTracking()
                .Include(f => f.Category)
                .Select(f => new FoodDto
                {
                    FoodId = f.MaMon,
                    FoodName = f.TenMon,
                    Price = f.GiaBan,
                    OriginalPrice = f.GiaGoc,
                    Description = f.NoiDung,
                    ImageUrl = f.Anh,
                    CategoryId = f.MaLoai,
                    CategoryName = f.Category != null
                        ? f.Category.CategoryName
                        : null
                })
                .ToListAsync();
        }
    }
}
