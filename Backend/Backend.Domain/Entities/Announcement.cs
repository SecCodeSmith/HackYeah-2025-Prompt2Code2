// File: Backend/Backend.Domain/Entities/Announcement.cs
using Backend.Domain.Common;

namespace Backend.Domain.Entities;

public class Announcement : BaseEntity
{
    public string Title { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public AnnouncementPriority Priority { get; set; } = AnnouncementPriority.Normal;
    public AnnouncementType Type { get; set; } = AnnouncementType.Information;
    public DateTime PublishedAt { get; set; }
    public DateTime? ExpiresAt { get; set; }
    public bool RequiresConfirmation { get; set; }
    public bool IsPublished { get; set; }
    public bool IsActive { get; set; } = true;
    public Guid? PodmiotId { get; set; }
    
    // Targeting
    public bool TargetAllEntities { get; set; } = true;
    public string? TargetEntityTypes { get; set; } // Comma-separated list of TypPodmiotu values
    public string? TargetSpecificEntities { get; set; } // Comma-separated list of Podmiot IDs
    
    // Navigation properties
    public User? Creator { get; set; }
    public Podmiot? TargetPodmiot { get; set; }
    public ICollection<AnnouncementConfirmation> Confirmations { get; set; } = new List<AnnouncementConfirmation>();
}

public class AnnouncementConfirmation : BaseEntity
{
    public Guid AnnouncementId { get; set; }
    public Guid UserId { get; set; }
    public DateTime ConfirmedAt { get; set; }
    
    // Navigation properties
    public Announcement Announcement { get; set; } = null!;
    public User User { get; set; } = null!;
}

public enum AnnouncementPriority
{
    Low = 0,
    Normal = 1,
    High = 2,
    Critical = 3
}

public enum AnnouncementType
{
    Information = 0,
    Warning = 1,
    Regulatory = 2,
    Technical = 3,
    Emergency = 4
}
