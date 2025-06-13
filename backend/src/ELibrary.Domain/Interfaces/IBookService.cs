using ELibrary.Core.DTOs;

public interface IBookService
{
    Task<IEnumerable<BookDto>> GetAllAsync();
    Task<BookDto?> GetByIdAsync(Guid id); 
    Task<BookDto> CreateAsync(BookDto dto);
    Task<bool> DeleteAsync(Guid id);
    Task<BookDto?> UpdateAsync(Guid id, BookDto dto);
    Task<bool> BorrowBookAsync(Guid bookId, Guid userId);
    Task<bool> ReturnBookAsync(Guid bookId, Guid userId);
}
