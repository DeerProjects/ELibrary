using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ELibrary.Models;
using ELibrary.Data;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly ELibraryDbContext _context;
    private readonly AuthHelper _authHelper;

    public AuthController(ELibraryDbContext context, IConfiguration config)
    {
        _context = context;
        _authHelper = new AuthHelper(config);
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register(User user)
    {
        if (await _context.Users.AnyAsync(u => u.Username == user.Username))
            return BadRequest("Username already exists.");

        user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(user.PasswordHash);
        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        return Ok("User registered successfully.");
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(User login)
    {
        var user = await _context.Users.SingleOrDefaultAsync(u => u.Username == login.Username);
        if (user == null || !BCrypt.Net.BCrypt.Verify(login.PasswordHash, user.PasswordHash))
            return Unauthorized("Invalid username or password.");

        var token = _authHelper.GenerateJwtToken(user.Username, user.Role);
        return Ok(new { token });
    }
}
