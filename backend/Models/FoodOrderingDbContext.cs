
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

        public DbSet<User> Users { get; set; }

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

            // Bảng tài khoản người dùng
            modelBuilder.Entity<User>(entity =>
            {
                entity.ToTable("Users");

                entity.HasKey(u => u.UID);

                entity.HasIndex(u => u.Taikhoan)
                    .IsUnique();

                entity.Property(u => u.UID)
                    .HasColumnName("UID");

                entity.Property(u => u.Hoten)
                    .HasColumnName("Hoten")
                    .HasMaxLength(100)
                    .IsRequired();

                entity.Property(u => u.Taikhoan)
                    .HasColumnName("Taikhoan")
                    .HasMaxLength(50)
                    .IsRequired();

                entity.Property(u => u.Matkhau)
                    .HasColumnName("Matkhau")
                    .HasMaxLength(100)
                    .IsRequired();

                entity.Property(u => u.Email)
                    .HasColumnName("Email")
                    .HasMaxLength(100);

                entity.Property(u => u.DienthoaiKH)
                    .HasColumnName("DienthoaiKH")
                    .HasMaxLength(15);

                entity.Property(u => u.DiachiKH)
                    .HasColumnName("DiachiKH")
                    .HasMaxLength(255);

                entity.Property(u => u.Ngaysinh)
                    .HasColumnName("Ngaysinh");

                entity.Property(u => u.Role)
                    .HasColumnName("Role")
                    .HasMaxLength(20)
                    .IsRequired();
            });
        }
    }
}
