using System.ComponentModel.DataAnnotations;

namespace ELibrary.Domain.Entities;

public class Category
{
    public Guid Id { get; set; }
    
    [Required]
    [MaxLength(50)]
    public string Name { get; set; } = string.Empty;
    
    [MaxLength(200)]
    public string? Description { get; set; }
    
    // Navigation property for books in this category
    public ICollection<Book> Books { get; set; } = new List<Book>();
} 