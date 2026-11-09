using Microsoft.EntityFrameworkCore;

namespace backend.Models
{
    public class FoodOrderingDbContext : DbContext
    {
        public FoodOrderingDbContext(
            DbContextOptions<FoodOrderingDbContext> options)
            : base(options)
        {
        }

        public DbSet<Category> Categories { get; set; }

        public DbSet<Food> Foods { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Bảng loại món ăn
            modelBuilder.Entity<Category>(entity =>
            {
                entity.ToTable("Loaimonan");

                entity.HasKey(c => c.CategoryId);

                entity.Property(c => c.CategoryId)
                    .HasColumnName("Maloai");

                entity.Property(c => c.CategoryName)
                    .HasColumnName("Tenloai")
                    .HasMaxLength(100)
                    .IsRequired();
            });

            // Bảng món ăn
            modelBuilder.Entity<Food>(entity =>
            {
                entity.ToTable("Monan");

                entity.HasKey(f => f.MaMon);

                entity.Property(f => f.MaMon)
                    .HasColumnName("Mamon");

                entity.Property(f => f.TenMon)
                    .HasColumnName("Tenmon")
                    .HasMaxLength(100)
                    .IsRequired();

                entity.Property(f => f.GiaBan)
                    .HasColumnName("Giaban")
                    .HasColumnType("decimal(10,2)");

                entity.Property(f => f.GiaGoc)
                    .HasColumnName("Giagoc")
                    .HasColumnType("decimal(10,2)");

                entity.Property(f => f.NoiDung)
                    .HasColumnName("Noidung");

                entity.Property(f => f.Anh)
                    .HasColumnName("Anh")
                    .HasMaxLength(255);

                entity.Property(f => f.MaLoai)
                    .HasColumnName("Maloai");

                entity.HasOne(f => f.Category)
                    .WithMany(c => c.Foods)
                    .HasForeignKey(f => f.MaLoai)
                    .IsRequired(false);
            });
        }
    }
}