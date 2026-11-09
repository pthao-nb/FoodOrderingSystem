
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{
    [Table("Users")]
    public class User
    {
        [Key]
        [Column("UID")]
        public int UID { get; set; }

        [Required]
        [MaxLength(100)]
        [Column("Hoten")]
        public string Hoten { get; set; } = string.Empty;

        [Required]
        [MaxLength(50)]
        [Column("Taikhoan")]
        public string Taikhoan { get; set; } = string.Empty;

        [Required]
        [MaxLength(100)]
        [Column("Matkhau")]
        public string Matkhau { get; set; } = string.Empty;

        [MaxLength(100)]
        [Column("Email")]
        public string? Email { get; set; }

        [MaxLength(15)]
        [Column("DienthoaiKH")]
        public string? DienthoaiKH { get; set; }

        [MaxLength(255)]
        [Column("DiachiKH")]
        public string? DiachiKH { get; set; }

        [Column("Ngaysinh")]
        public DateTime? Ngaysinh { get; set; }

        [Required]
        [MaxLength(20)]
        [Column("Role")]
        public string Role { get; set; } = "khach";
    }
}
