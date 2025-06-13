using ELibrary.Core.Enums;
using System.ComponentModel.DataAnnotations;

namespace ELibrary.Domain.Entities;

public class User
{
    public Guid Id { get; set; }
    
    [Required]
    [MaxLength(50)]
    public string Username { get; set; } = string.Empty;
    
    [Required]
    public string PasswordHash { get; set; } = string.Empty;
    
    [MaxLength(100)]
    public string? Email { get; set; }
    
    [MaxLength(100)]
    public string? FullName { get; set; }
    
    public UserRole Role { get; set; }
    
    // Navigation properties
    public ICollection<Book> BorrowedBooks { get; set; } = new List<Book>();
    public ICollection<Fine> Fines { get; set; } = new List<Fine>();
}