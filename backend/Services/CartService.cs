using backend.Models;
using Microsoft.EntityFrameworkCore;
using System.Data;

namespace backend.Services;

public class CartService(FoodOrderingDbContext context) : ICartService
{
    public async Task<bool> AddItemAsync(int userId, int foodId)
    {
        if (!await context.Foods.AnyAsync(f => f.MaMon == foodId) ||
            !await context.Users.AnyAsync(u => u.UID == userId)) return false;

        // Serialize updates so concurrent clicks cannot create duplicate cart rows.
        await using var transaction = await context.Database.BeginTransactionAsync(IsolationLevel.Serializable);
        var updated = await context.Database.ExecuteSqlInterpolatedAsync($"UPDATE Giohang SET Soluong = Soluong + 1 WHERE UID = {userId} AND Mamon = {foodId}");
        if (updated == 0)
            await context.Database.ExecuteSqlInterpolatedAsync($"INSERT INTO Giohang (UID, Mamon, Soluong) VALUES ({userId}, {foodId}, 1)");
        await transaction.CommitAsync();
        return true;
    }
}
