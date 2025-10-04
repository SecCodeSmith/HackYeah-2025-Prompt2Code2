// File: Backend/Backend.Domain/Entities/Announcement.cs
using Backend.Domain.Common;

namespace Backend.Domain.Entities;

public class Announcement : BaseEntity
{
    public string Title { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public AnnouncementPriority Priority { get; set; }
    public bool IsActive { get; set; } = true;
    public Guid CreatedBy { get; set; }
    
    // Navigation properties
    public User Creator { get; set; } = null!;
}

public enum AnnouncementPriority
{
    Low = 0,
    Medium = 1,
    High = 2,
    Critical = 3
}
