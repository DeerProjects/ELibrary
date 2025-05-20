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
            .Select(b => new BookDto
            {
                Id = b.Id,
                Title = b.Title,
                Author = b.Author
            }).ToListAsync();
    }

    public async Task<BookDto?> GetByIdAsync(Guid id)
    {
        var book = await _context.Books.FindAsync(id);
        if (book == null) return null;

        return new BookDto
        {
            Id = book.Id,
            Title = book.Title,
            Author = book.Author
        };
    }

    public async Task<BookDto> CreateAsync(BookDto dto)
    {
        var book = new Book
        {
            Id = Guid.NewGuid(),
            Title = dto.Title,
            Author = dto.Author
        };

        _context.Books.Add(book);
        await _context.SaveChangesAsync();

        dto.Id = book.Id;
        return dto;
    }

    public async Task<BookDto?> UpdateAsync(Guid id, BookDto dto)
    {
        var book = await _context.Books.FindAsync(id);
        if (book == null) return null;

        book.Title = dto.Title;
        book.Author = dto.Author;

        await _context.SaveChangesAsync();

        return new BookDto
        {
            Id = book.Id,
            Title = book.Title,
            Author = book.Author
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
}
