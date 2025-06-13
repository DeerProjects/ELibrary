using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using ELibrary.Core.DTOs;
using ELibrary.Domain.Entities;
using ELibrary.Domain.Interfaces;
using ELibrary.Infrastructure;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;


namespace ELibrary.Services.Services.AuthService;

public class AuthService : IAuthService
{
    private readonly AppDbContext _context;

    private readonly string _jwtSecret = "super_secure_secret_key_for_demo";

    public AuthService(AppDbContext context)
    {
        _context = context;
    }
      public async Task<string?> Login(UserLoginDto dto)
    {
        var user = await _context.Users.FirstOrDefaultAsync(x => x.Username == dto.Username);
        if(user == null)
        {
            Console.WriteLine($"Login failed: User {dto.Username} not found");
            return null;
        }
        
        var passwordValid = BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash);
        if(!passwordValid)
        {
            Console.WriteLine($"Login failed: Invalid password for user {dto.Username}");
            return null;
        }

        Console.WriteLine($"Login successful for user {dto.Username}");
        return GenerateJwt(user);
    }

    public async Task<User> Register(UserRegisterDto dto)
    {
        var user = new User
        {
            Id = Guid.NewGuid(),
            Username = dto.Username,
            Role = dto.Role,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password)
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        return user;
    }

    public async Task<UserDto?> GetUserProfile(Guid userId)
    {
        var user = await _context.Users.FindAsync(userId);
        if (user == null) return null;

        return new UserDto
        {
            Id = user.Id,
            Username = user.Username,
            Role = user.Role.ToString()
        };
    }

    public async Task<UserDto?> UpdateProfile(Guid userId, UpdateUserDto dto)
    {
        var user = await _context.Users.FindAsync(userId);
        if (user == null) return null;

        // Verify current password
        if (!BCrypt.Net.BCrypt.Verify(dto.CurrentPassword, user.PasswordHash))
            return null;

        // Update username if changed
        if (!string.IsNullOrEmpty(dto.Username) && dto.Username != user.Username)
            user.Username = dto.Username;

        // Update password if provided
        if (!string.IsNullOrEmpty(dto.NewPassword))
            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.NewPassword);

        await _context.SaveChangesAsync();

        return new UserDto
        {
            Id = user.Id,
            Username = user.Username,
            Role = user.Role.ToString()
        };
    }

      private string GenerateJwt(User user)
    {
        var handler = new JwtSecurityTokenHandler();
        var key = Encoding.ASCII.GetBytes(_jwtSecret);

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Name, user.Username),
                new Claim(ClaimTypes.Role, user.Role.ToString())
            }),
            Expires = DateTime.UtcNow.AddHours(1),
            SigningCredentials = new SigningCredentials(
                new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
        };

        var token = handler.CreateToken(tokenDescriptor);
        return handler.WriteToken(token);
    }

}