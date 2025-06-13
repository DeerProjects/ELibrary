using ELibrary.Core.Enums;
using System.ComponentModel.DataAnnotations;

namespace ELibrary.Domain.Entities;

public class Book
{
    public Guid Id { get; set; }
    
    [Required]
    [MaxLength(200)]
    public string Title { get; set; } = string.Empty;
    
    [MaxLength(100)]
    public string Cover { get; set; } = string.Empty;
    
    [MaxLength(1000)]
    public string? Description { get; set; }
    
    public BookStatus Status { get; set; }
    public Guid? BorrowedByUserId { get; set; }
    public Guid? CategoryId { get; set; }
    
    // Navigation properties
    public User? BorrowedByUser { get; set; }
    public Category? Category { get; set; }
    public ICollection<BookAuthor> BookAuthors { get; set; } = new List<BookAuthor>();
    public ICollection<Fine> Fines { get; set; } = new List<Fine>();
}
