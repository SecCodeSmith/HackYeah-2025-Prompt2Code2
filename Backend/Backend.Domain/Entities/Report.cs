using Backend.Domain.Common;

namespace Backend.Domain.Entities;

public class Report : BaseEntity
{
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public ReportStatus Status { get; set; } = ReportStatus.Draft;
    public ReportPriority Priority { get; set; } = ReportPriority.Normal;
    public string? Category { get; set; }
    public Guid UserId { get; set; }
    public DateTime? SubmittedAt { get; set; }
    public DateTime? ReviewedAt { get; set; }
    public string? ReviewNotes { get; set; }
    
    // Navigation properties
    public User User { get; set; } = null!;
    public ICollection<ReportAttachment> Attachments { get; set; } = new List<ReportAttachment>();
}

public enum ReportStatus
{
    Draft = 0,
    Submitted = 1,
    UnderReview = 2,
    Approved = 3,
    Rejected = 4,
    Archived = 5
}

public enum ReportPriority
{
    Low = 0,
    Normal = 1,
    High = 2,
    Critical = 3
}
