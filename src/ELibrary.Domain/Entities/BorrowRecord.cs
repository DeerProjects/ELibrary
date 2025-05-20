namespace ELibrary.Domain.Entities;

public class BorrowRecord
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public Guid Bookid { get; set; }
    public DateTime BorrowedAt { get; set; }
    public DateTime? ReturnedAt { get; set; }

}