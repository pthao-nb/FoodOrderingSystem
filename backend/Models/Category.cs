using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{
    [Table("Loaimonan")]
    public class Category
    {
        [Key]
        [Column("Maloai")]
        public int CategoryId { get; set; }

        [Column("Tenloai")]
        [Required]
        [MaxLength(100)]
        public string CategoryName { get; set; } = string.Empty;

        public ICollection<Food> Foods { get; set; } = new List<Food>();
    }
}