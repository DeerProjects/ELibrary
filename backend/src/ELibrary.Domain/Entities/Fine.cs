namespace ELibrary.Domain.Entities;

public class Fine
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public Guid BookId { get; set; }
    public decimal Amount { get; set; }
    public DateTime DueDate { get; set; }
    public DateTime? PaidDate { get; set; }
    public bool IsPaid => PaidDate.HasValue;
    
    // Navigation properties
    public User User { get; set; } = null!;
    public Book Book { get; set; } = null!;
} 