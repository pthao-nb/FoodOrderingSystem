
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

        public async Task<List<FoodDto>> GetSuggestionsAsync(string keyword)
        {
            keyword = keyword.Trim();
            if (keyword.Length == 0) return [];
            return await _context.Foods.AsNoTracking()
                .Where(f => EF.Functions.Collate(f.TenMon, "Latin1_General_100_CI_AI").Contains(keyword))
                .OrderBy(f => f.TenMon).ThenBy(f => f.MaMon)
                .Select(f => new FoodDto { FoodId = f.MaMon, FoodName = f.TenMon, Price = f.GiaBan })
                .ToListAsync();
        }

        public async Task<MenuResult> GetMenuAsync(MenuQuery query)
        {
            var foods = _context.Foods.AsNoTracking().AsQueryable();
            var keyword = query.Keyword?.Trim();
            if (!string.IsNullOrEmpty(keyword))
            {
                // Accent-insensitive Vietnamese search; Contains treats wildcard characters literally.
                foods = foods.Where(f =>
                    EF.Functions.Collate(f.TenMon, "Latin1_General_100_CI_AI").Contains(keyword) ||
                    (query.SearchInDescription && f.NoiDung != null && EF.Functions.Collate(f.NoiDung, "Latin1_General_100_CI_AI").Contains(keyword)));
            }
            if (query.CategoryId.HasValue)
                foods = foods.Where(f => f.MaLoai == query.CategoryId);
            foods = query.PriceRange switch
            {
                "under-30000" => foods.Where(f => f.GiaBan < 30000),
                "30000-50000" => foods.Where(f => f.GiaBan >= 30000 && f.GiaBan < 50000),
                "50000-100000" => foods.Where(f => f.GiaBan >= 50000 && f.GiaBan <= 100000),
                "over-100000" => foods.Where(f => f.GiaBan > 100000),
                _ => foods
            };
            var total = await foods.CountAsync();
            var sorted = query.Sort switch
            {
                "name-asc" => foods.OrderBy(f => f.TenMon).ThenBy(f => f.MaMon),
                "name-desc" => foods.OrderByDescending(f => f.TenMon).ThenBy(f => f.MaMon),
                "price-asc" => foods.OrderBy(f => f.GiaBan).ThenBy(f => f.MaMon),
                "price-desc" => foods.OrderByDescending(f => f.GiaBan).ThenBy(f => f.MaMon),
                _ => foods.OrderBy(f => f.MaMon)
            };
            const int pageSize = 8;
            var page = Math.Min(query.Page, Math.Max(1, (int)Math.Ceiling(total / (double)pageSize)));
            var items = await sorted.Skip((page - 1) * pageSize).Take(pageSize)
                .Select(f => new FoodDto
                {
                    FoodId = f.MaMon, FoodName = f.TenMon, Price = f.GiaBan,
                    OriginalPrice = f.GiaGoc, Description = f.NoiDung, ImageUrl = f.Anh,
                    CategoryId = f.MaLoai,
                    CategoryName = f.Category != null ? f.Category.CategoryName : null
                }).ToListAsync();
            return new MenuResult(items, total, page, pageSize);
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
