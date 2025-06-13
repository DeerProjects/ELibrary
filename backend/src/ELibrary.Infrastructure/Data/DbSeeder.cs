using ELibrary.Core.Enums;
using ELibrary.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace ELibrary.Infrastructure.Data;

public static class DbSeeder
{
    public static async Task SeedAsync(AppDbContext context)
    {
        await context.Database.MigrateAsync();

        if (!await context.Users.AnyAsync())
        {
            var admin = new User
            {
                Id = Guid.NewGuid(),
                Username = "admin",
                Role = UserRole.Admin,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("admin123")
            };

            context.Users.Add(admin);
            await context.SaveChangesAsync();
        }
    }
}
