
using backend.DTOs.Food;
using backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FoodController : ControllerBase
    {
        private readonly IFoodService _foodService;

        public FoodController(IFoodService foodService)
        {
            _foodService = foodService;
        }

        // GET: api/Food
        [HttpGet]
        public async Task<ActionResult<List<FoodDto>>> GetAllFoods()
        {
            var foods = await _foodService.GetAllFoodsAsync();

            return Ok(foods);
        }
    }
}
