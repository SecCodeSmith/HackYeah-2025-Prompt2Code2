using Backend.Domain.Common;
using Backend.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Backend.Infrastructure.Persistence;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public DbSet<User> Users => Set<User>();
    public DbSet<Report> Reports => Set<Report>();
    public DbSet<ReportAttachment> ReportAttachments => Set<ReportAttachment>();
    public DbSet<RefreshToken> RefreshTokens => Set<RefreshToken>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // User configuration
        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Email).IsRequired().HasMaxLength(256);
            entity.HasIndex(e => e.Email).IsUnique();
            entity.Property(e => e.FirstName).IsRequired().HasMaxLength(100);
            entity.Property(e => e.LastName).IsRequired().HasMaxLength(100);
            entity.Property(e => e.PhoneNumber).HasMaxLength(20);
            
            entity.HasMany(e => e.Reports)
                .WithOne(r => r.User)
                .HasForeignKey(r => r.UserId)
                .OnDelete(DeleteBehavior.Cascade);
                
            entity.HasMany(e => e.RefreshTokens)
                .WithOne(rt => rt.User)
                .HasForeignKey(rt => rt.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // Report configuration
        modelBuilder.Entity<Report>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Title).IsRequired().HasMaxLength(200);
            entity.Property(e => e.Description).IsRequired().HasMaxLength(2000);
            entity.Property(e => e.Category).HasMaxLength(100);
            entity.Property(e => e.ReviewNotes).HasMaxLength(1000);
            
            entity.HasOne(e => e.User)
                .WithMany(u => u.Reports)
                .HasForeignKey(e => e.UserId)
                .OnDelete(DeleteBehavior.Restrict);
                
            entity.HasMany(e => e.Attachments)
                .WithOne(a => a.Report)
                .HasForeignKey(a => a.ReportId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // ReportAttachment configuration
        modelBuilder.Entity<ReportAttachment>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.FileName).IsRequired().HasMaxLength(255);
            entity.Property(e => e.FilePath).IsRequired().HasMaxLength(500);
            entity.Property(e => e.ContentType).IsRequired().HasMaxLength(100);
        });

        // RefreshToken configuration
        modelBuilder.Entity<RefreshToken>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Token).IsRequired().HasMaxLength(500);
            entity.HasIndex(e => e.Token).IsUnique();
            entity.Property(e => e.CreatedByIp).IsRequired().HasMaxLength(50);
            entity.Property(e => e.RevokedByIp).HasMaxLength(50);
            entity.Property(e => e.ReplacedByToken).HasMaxLength(500);
        });
    }

    public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        var entries = ChangeTracker.Entries<BaseEntity>();
        
        foreach (var entry in entries)
        {
            if (entry.State == EntityState.Added)
            {
                entry.Entity.CreatedAt = DateTime.UtcNow;
            }
            else if (entry.State == EntityState.Modified)
            {
                entry.Entity.UpdatedAt = DateTime.UtcNow;
            }
        }
        
        return base.SaveChangesAsync(cancellationToken);
    }
}
