using backend.Models;
using backend.Services;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// 1. Đăng ký Controllers
builder.Services.AddControllers();

// 2. Kết nối SQL Server
builder.Services.AddDbContext<FoodOrderingDbContext>(options =>
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("DefaultConnection")));

// 3. Đăng ký FoodService
builder.Services.AddScoped<IFoodService, FoodService>();

// 4. Cấu hình CORS cho Angular
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngular", policy =>
    {
        policy
        .WithOrigins("http://localhost:4200")
        .AllowAnyHeader()
        .AllowAnyMethod();
    });
});

// 5. Cấu hình Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// 6. Hiển thị Swagger trong môi trường Development
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// 7. Chuyển hướng HTTP sang HTTPS
app.UseHttpsRedirection();

// 8. Áp dụng CORS
app.UseCors("AllowAngular");

// 9. Ánh xạ các API Controller
app.MapControllers();

// 10. Chạy ứng dụng
app.Run();