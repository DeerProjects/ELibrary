using System.ComponentModel.DataAnnotations;

namespace ELibrary.Domain.Entities;

public class Author
{
    public Guid Id { get; set; }
    
    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;
    
    [MaxLength(500)]
    public string? Biography { get; set; }
    
    public DateTime? DateOfBirth { get; set; }
    public DateTime? DateOfDeath { get; set; }
    
    // Navigation property for many-to-many relationship with books
    public ICollection<BookAuthor> BookAuthors { get; set; } = new List<BookAuthor>();
} 