using ELibrary.Domain.Entities;
using ELibrary.Core.DTOs;
using ELibrary.Domain.Interfaces;
using ELibrary.Infrastructure;
using Microsoft.EntityFrameworkCore;

namespace ELibrary.Services.Services;

public class BookService : IBookService
{
    private readonly AppDbContext _context;

    public BookService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<BookDto>> GetAllAsync()
    {
        return await _context.Books
            .Include(b => b.BookAuthors)
                .ThenInclude(ba => ba.Author)
            .Include(b => b.BorrowedByUser)
            .Select(b => new BookDto
            {
                Id = b.Id,
                Title = b.Title,
                Authors = b.BookAuthors.Select(ba => ba.Author.Name).ToList(),
                Cover = b.Cover,
                Description = b.Description,
                Status = (int)b.Status,
                BorrowedByUserId = b.BorrowedByUserId,
                BorrowedByUsername = b.BorrowedByUser != null ? b.BorrowedByUser.Username : null
            }).ToListAsync();
    }

    public async Task<BookDto?> GetByIdAsync(Guid id)
    {
        var book = await _context.Books
            .Include(b => b.BookAuthors)
                .ThenInclude(ba => ba.Author)
            .Include(b => b.BorrowedByUser)
            .FirstOrDefaultAsync(b => b.Id == id);

        if (book == null) return null;

        return new BookDto
        {
            Id = book.Id,
            Title = book.Title,
            Authors = book.BookAuthors.Select(ba => ba.Author.Name).ToList(),
            Cover = book.Cover,
            Description = book.Description,
            Status = (int)book.Status,
            BorrowedByUserId = book.BorrowedByUserId,
            BorrowedByUsername = book.BorrowedByUser != null ? book.BorrowedByUser.Username : null
        };
    }

    public async Task<BookDto> CreateAsync(BookDto dto)
    {
        var book = new Book
        {
            Id = Guid.NewGuid(),
            Title = dto.Title,
            Cover = dto.Cover,
            Description = dto.Description
        };

        // Handle authors
        if (dto.Authors != null && dto.Authors.Any())
        {
            foreach (var authorName in dto.Authors)
            {
                var author = await _context.Authors
                    .FirstOrDefaultAsync(a => a.Name == authorName) 
                    ?? new Author 
                    { 
                        Id = Guid.NewGuid(), 
                        Name = authorName 
                    };

                book.BookAuthors.Add(new BookAuthor 
                { 
                    Book = book, 
                    Author = author 
                });
            }
        }

        _context.Books.Add(book);
        await _context.SaveChangesAsync();

        dto.Id = book.Id;
        return dto;
    }

    public async Task<BookDto?> UpdateAsync(Guid id, BookDto dto)
    {
        var book = await _context.Books
            .Include(b => b.BookAuthors)
                .ThenInclude(ba => ba.Author)
            .FirstOrDefaultAsync(b => b.Id == id);

        if (book == null) return null;

        book.Title = dto.Title;
        book.Cover = dto.Cover;
        book.Description = dto.Description;

        // Update authors
        if (dto.Authors != null)
        {
            // Remove existing authors
            book.BookAuthors.Clear();

            // Add new authors
            foreach (var authorName in dto.Authors)
            {
                var author = await _context.Authors
                    .FirstOrDefaultAsync(a => a.Name == authorName)
                    ?? new Author
                    {
                        Id = Guid.NewGuid(),
                        Name = authorName
                    };

                book.BookAuthors.Add(new BookAuthor
                {
                    Book = book,
                    Author = author
                });
            }
        }

        await _context.SaveChangesAsync();

        return new BookDto
        {
            Id = book.Id,
            Title = book.Title,
            Authors = book.BookAuthors.Select(ba => ba.Author.Name).ToList(),
            Cover = book.Cover,
            Description = book.Description
        };
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        var book = await _context.Books.FindAsync(id);
        if (book == null) return false;

        _context.Books.Remove(book);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> BorrowBookAsync(Guid bookId, Guid userId)
    {
        var book = await _context.Books.FindAsync(bookId);
        if (book == null) return false;
        if (book.Status == ELibrary.Core.Enums.BookStatus.Borrowed) return false;
        book.Status = ELibrary.Core.Enums.BookStatus.Borrowed;
        book.BorrowedByUserId = userId;
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> ReturnBookAsync(Guid bookId, Guid userId)
    {
        var book = await _context.Books.FindAsync(bookId);
        if (book == null) return false;
        if (book.Status == ELibrary.Core.Enums.BookStatus.Available) return false;
        if (book.BorrowedByUserId != userId) return false;
        book.Status = ELibrary.Core.Enums.BookStatus.Available;
        book.BorrowedByUserId = null;
        await _context.SaveChangesAsync();
        return true;
    }
}
