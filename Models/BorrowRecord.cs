using System;

namespace ELibrary.Models;

public class BorrowRecord
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public int BookId { get; set; }
    public DateTime BorrowedOn { get; set; }
    public DateTime? ReturnedOn { get; set; }

    public User User { get; set; }
    public Book Book { get; set; }
}
