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
    public DbSet<Podmiot> Podmioty => Set<Podmiot>();
    public DbSet<Announcement> Announcements => Set<Announcement>();
    // TODO: Add after migration
    // public DbSet<AnnouncementConfirmation> AnnouncementConfirmations => Set<AnnouncementConfirmation>();
    // public DbSet<Message> Messages => Set<Message>();
    // public DbSet<MessageAttachment> MessageAttachments => Set<MessageAttachment>();

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

        // Podmiot configuration
        modelBuilder.Entity<Podmiot>(entity =>
        {
            entity.HasKey(p => p.Id);
            entity.Property(p => p.KodUKNF).IsRequired().HasMaxLength(50);
            entity.HasIndex(p => p.KodUKNF).IsUnique();
            entity.Property(p => p.Nazwa).IsRequired().HasMaxLength(500);
            entity.Property(p => p.TypPodmiotu).IsRequired();
            entity.Property(p => p.Status).IsRequired();
            entity.Property(p => p.NIP).HasMaxLength(20);
            entity.Property(p => p.REGON).HasMaxLength(20);
            entity.Property(p => p.KRS).HasMaxLength(20);
            entity.Property(p => p.Email).HasMaxLength(100);
            entity.Property(p => p.Telefon).HasMaxLength(20);
            entity.Property(p => p.Adres).HasMaxLength(500);
            entity.Property(p => p.Uwagi).HasMaxLength(2000);
        });

        // Announcement configuration - extended entity (base configuration already exists)
        modelBuilder.Entity<Announcement>(entity =>
        {
            entity.Property(a => a.Type).IsRequired();
            entity.Property(a => a.IsActive).IsRequired().HasDefaultValue(true);
            entity.Property(a => a.TargetAllEntities).IsRequired().HasDefaultValue(true);
            entity.Property(a => a.TargetEntityTypes).HasMaxLength(500);
            entity.Property(a => a.TargetSpecificEntities).HasMaxLength(2000);
            entity.HasOne(a => a.TargetPodmiot)
                .WithMany()
                .HasForeignKey(a => a.PodmiotId)
                .OnDelete(DeleteBehavior.SetNull)
                .IsRequired(false);
        });

        // TODO: Add these configurations after creating Messages feature
        // AnnouncementConfirmation configuration
        // modelBuilder.Entity<AnnouncementConfirmation>(entity =>
        // {
        //     entity.HasKey(ac => ac.Id);
        //     entity.HasOne(ac => ac.Announcement)
        //         .WithMany(a => a.Confirmations)
        //         .HasForeignKey(ac => ac.AnnouncementId)
        //         .OnDelete(DeleteBehavior.Cascade);
        //     entity.HasOne(ac => ac.User)
        //         .WithMany()
        //         .HasForeignKey(ac => ac.UserId)
        //         .OnDelete(DeleteBehavior.Restrict);
        //     entity.HasIndex(ac => new { ac.AnnouncementId, ac.UserId }).IsUnique();
        // });

        // // Message configuration
        // modelBuilder.Entity<Message>(entity =>
        // {
        //     entity.HasKey(m => m.Id);
        //     entity.Property(m => m.Subject).IsRequired().HasMaxLength(500);
        //     entity.Property(m => m.Content).IsRequired();
        //     entity.Property(m => m.Priority).IsRequired();
        //     entity.Property(m => m.Status).IsRequired();
        //     entity.HasOne(m => m.Sender)
        //         .WithMany()
        //         .HasForeignKey(m => m.SenderId)
        //         .OnDelete(DeleteBehavior.Restrict);
        //     entity.HasOne(m => m.Recipient)
        //         .WithMany()
        //         .HasForeignKey(m => m.RecipientId)
        //         .OnDelete(DeleteBehavior.Restrict);
        //     entity.HasOne(m => m.RelatedPodmiot)
        //         .WithMany()
        //         .HasForeignKey(m => m.PodmiotId)
        //         .OnDelete(DeleteBehavior.SetNull)
        //         .IsRequired(false);
        //     entity.HasOne(m => m.ParentMessage)
        //         .WithMany(m => m.Replies)
        //         .HasForeignKey(m => m.ParentMessageId)
        //         .OnDelete(DeleteBehavior.Restrict)
        //         .IsRequired(false);
        // });

        // // MessageAttachment configuration
        // modelBuilder.Entity<MessageAttachment>(entity =>
        // {
        //     entity.HasKey(ma => ma.Id);
        //     entity.Property(ma => ma.FileName).IsRequired().HasMaxLength(500);
        //     entity.Property(ma => ma.FilePath).IsRequired().HasMaxLength(1000);
        //     entity.Property(ma => ma.FileSize).IsRequired();
        //     entity.Property(ma => ma.ContentType).HasMaxLength(100);
        //     entity.HasOne(ma => ma.Message)
        //         .WithMany(m => m.Attachments)
        //         .HasForeignKey(ma => ma.MessageId)
        //         .OnDelete(DeleteBehavior.Cascade);
        // });
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
