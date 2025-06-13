namespace ELibrary.Core.DTOs
{
    public class BookDto
    {
        public Guid Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public List<string> Authors { get; set; } = new();
        public string Cover { get; set; } = string.Empty;
        public string? Description { get; set; }
        public int Status { get; set; } // 0: Available, 1: Borrowed
        public Guid? BorrowedByUserId { get; set; }
        public string? BorrowedByUsername { get; set; }
    }
}
