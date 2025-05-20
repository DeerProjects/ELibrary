using ELibrary.Core.Enums;

namespace ELibrary.Domain.Entities;

public class Book
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Author { get; set; } = string.Empty;

    public BookStatus Status { get; set; }
    public Guid? BorrowedByUserId { get; set; }

}
