using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{
    [Table("Monan")]
    public class Food
    {
        [Key]
        [Column("Mamon")]
        public int MaMon { get; set; }

        [Column("Tenmon")]
        [Required]
        [MaxLength(100)]
        public string TenMon { get; set; } = string.Empty;

        [Column("Giaban", TypeName = "decimal(10,2)")]
        public decimal GiaBan { get; set; }

        [Column("Giagoc", TypeName = "decimal(10,2)")]
        public decimal? GiaGoc { get; set; }

        [Column("Noidung")]
        public string? NoiDung { get; set; }

        [Column("Anh")]
        public string? Anh { get; set; }

        [Column("Maloai")]
        public int? MaLoai { get; set; }

        public Category? Category { get; set; }
    }
}