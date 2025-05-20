using Microsoft.EntityFrameworkCore;
using ELibrary.Domain.Entities;
using System.Runtime.Intrinsics.X86;

namespace ELibrary.Infrastructure;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<User> Users => Set<User>();
    public DbSet<Book> Books => Set<Book>();
}