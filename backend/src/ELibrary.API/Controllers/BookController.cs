using ELibrary.Core.DTOs;
using ELibrary.Domain.Interfaces;
using ELibrary.Services.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ELibrary.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class BookController : ControllerBase
{
    private readonly IBookService _service;

    public BookController(IBookService service)
    {
        _service = service;
    }

    private void SeedBooksIfEmpty()
    {
        if (!_service.GetAllAsync().Result.Any())
        {
            var books = new List<BookDto>
            {
                new BookDto { Title = "The Great Gatsby", Authors = new List<string>{"F. Scott Fitzgerald"}, Description = "A novel set in the Roaring Twenties.", Cover = "https://covers.openlibrary.org/b/id/7222246-L.jpg" },
                new BookDto { Title = "To Kill a Mockingbird", Authors = new List<string>{"Harper Lee"}, Description = "A story of racial injustice in the Deep South.", Cover = "https://covers.openlibrary.org/b/id/8228691-L.jpg" },
                new BookDto { Title = "1984", Authors = new List<string>{"George Orwell"}, Description = "A dystopian novel about totalitarianism.", Cover = "https://covers.openlibrary.org/b/id/11153223-L.jpg" },
                new BookDto { Title = "Moby-Dick", Authors = new List<string>{"Herman Melville"}, Description = "The quest for the white whale.", Cover = "https://covers.openlibrary.org/b/id/8100921-L.jpg" },
                new BookDto { Title = "Pride and Prejudice", Authors = new List<string>{"Jane Austen"}, Description = "A classic romance novel.", Cover = "https://covers.openlibrary.org/b/id/8231996-L.jpg" },
                new BookDto { Title = "Brave New World", Authors = new List<string>{"Aldous Huxley"}, Description = "A futuristic dystopian novel.", Cover = "https://covers.openlibrary.org/b/id/8775116-L.jpg" },
                new BookDto { Title = "The Hobbit", Authors = new List<string>{"J.R.R. Tolkien"}, Description = "A fantasy adventure.", Cover = "https://covers.openlibrary.org/b/id/6979861-L.jpg" },
                new BookDto { Title = "The Catcher in the Rye", Authors = new List<string>{"J.D. Salinger"}, Description = "A story about teenage rebellion.", Cover = "https://covers.openlibrary.org/b/id/8231856-L.jpg" },
                new BookDto { Title = "War and Peace", Authors = new List<string>{"Leo Tolstoy"}, Description = "A historical epic.", Cover = "https://covers.openlibrary.org/b/id/7222161-L.jpg" },
                new BookDto { Title = "The Brothers Karamazov", Authors = new List<string>{"Fyodor Dostoevsky"}, Description = "A philosophical novel.", Cover = "https://covers.openlibrary.org/b/id/8235116-L.jpg" }
            };
            foreach (var book in books)
            {
                _service.CreateAsync(book).Wait();
            }
        }
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        SeedBooksIfEmpty();
        var books = await _service.GetAllAsync();
        return Ok(books);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var book = await _service.GetByIdAsync(id);
        return book == null ? NotFound() : Ok(book);
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Create(BookDto dto)
    {
        var created = await _service.CreateAsync(dto);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Update(Guid id, BookDto dto)
    {
        var updated = await _service.UpdateAsync(id, dto);
        return updated == null ? NotFound() : Ok(updated);
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var deleted = await _service.DeleteAsync(id);
        return deleted ? NoContent() : NotFound();
    }

    [HttpPost("{id}/borrow")]
    [Authorize]
    public async Task<IActionResult> BorrowBook(Guid id)
    {
        var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier);
        if (userIdClaim == null) return Unauthorized();
        if (!Guid.TryParse(userIdClaim.Value, out Guid userId)) return BadRequest("Invalid user ID");

        var book = await _service.GetByIdAsync(id);
        if (book == null) return NotFound();
        if (book.Status == (int)ELibrary.Core.Enums.BookStatus.Borrowed)
            return BadRequest("Book is already borrowed.");

        var result = await _service.BorrowBookAsync(id, userId);
        if (!result) return BadRequest("Could not borrow book.");
        return Ok();
    }

    [HttpPost("{id}/return")]
    [Authorize]
    public async Task<IActionResult> ReturnBook(Guid id)
    {
        var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier);
        if (userIdClaim == null) return Unauthorized();
        if (!Guid.TryParse(userIdClaim.Value, out Guid userId)) return BadRequest("Invalid user ID");

        var book = await _service.GetByIdAsync(id);
        if (book == null) return NotFound();
        if (book.Status == (int)ELibrary.Core.Enums.BookStatus.Available)
            return BadRequest("Book is not borrowed.");
        if (book.BorrowedByUserId != userId)
            return Forbid();

        var result = await _service.ReturnBookAsync(id, userId);
        if (!result) return BadRequest("Could not return book.");
        return Ok();
    }
}

