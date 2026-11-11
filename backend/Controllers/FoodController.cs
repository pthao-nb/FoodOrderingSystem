using System.ComponentModel.DataAnnotations;

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

        [HttpGet("suggestions")]
        public async Task<ActionResult<List<FoodDto>>> GetSuggestions(
            [FromQuery, StringLength(150)] string keyword = "")
            => Ok(await _foodService.GetSuggestionsAsync(keyword));

        [HttpGet("menu")]
        public async Task<ActionResult<MenuResult>> GetMenu([FromQuery] MenuQuery query)
            => Ok(await _foodService.GetMenuAsync(query));

        // GET: api/Food
        [HttpGet]
        public async Task<ActionResult<List<FoodDto>>> GetAllFoods()
        {
            var foods = await _foodService.GetAllFoodsAsync();

            return Ok(foods);
        }
    }
}
