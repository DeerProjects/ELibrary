using Microsoft.EntityFrameworkCore;
using ELibrary.Domain.Entities;
using System.Runtime.Intrinsics.X86;

namespace ELibrary.Infrastructure;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<User> Users => Set<User>();
    public DbSet<Book> Books => Set<Book>();
    public DbSet<Author> Authors => Set<Author>();
    public DbSet<BookAuthor> BookAuthors => Set<BookAuthor>();
    public DbSet<Category> Categories => Set<Category>();
    public DbSet<Fine> Fines => Set<Fine>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Configure BookAuthor many-to-many relationship
        modelBuilder.Entity<BookAuthor>()
            .HasKey(ba => new { ba.BookId, ba.AuthorId });

        modelBuilder.Entity<BookAuthor>()
            .HasOne(ba => ba.Book)
            .WithMany(b => b.BookAuthors)
            .HasForeignKey(ba => ba.BookId);

        modelBuilder.Entity<BookAuthor>()
            .HasOne(ba => ba.Author)
            .WithMany(a => a.BookAuthors)
            .HasForeignKey(ba => ba.AuthorId);

        // Configure Book-Category relationship
        modelBuilder.Entity<Book>()
            .HasOne(b => b.Category)
            .WithMany(c => c.Books)
            .HasForeignKey(b => b.CategoryId)
            .OnDelete(DeleteBehavior.SetNull);

        // Configure Book-User relationship (for borrowed books)
        modelBuilder.Entity<Book>()
            .HasOne(b => b.BorrowedByUser)
            .WithMany(u => u.BorrowedBooks)
            .HasForeignKey(b => b.BorrowedByUserId)
            .OnDelete(DeleteBehavior.SetNull);

        // Configure Fine relationships
        modelBuilder.Entity<Fine>()
            .HasOne(f => f.User)
            .WithMany(u => u.Fines)
            .HasForeignKey(f => f.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Fine>()
            .HasOne(f => f.Book)
            .WithMany(b => b.Fines)
            .HasForeignKey(f => f.BookId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}