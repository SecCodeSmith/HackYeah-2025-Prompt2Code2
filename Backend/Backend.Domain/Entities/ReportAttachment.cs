using Backend.Domain.Common;

namespace Backend.Domain.Entities;

public class ReportAttachment : BaseEntity
{
    public Guid ReportId { get; set; }
    public string FileName { get; set; } = string.Empty;
    public string FilePath { get; set; } = string.Empty;
    public string ContentType { get; set; } = string.Empty;
    public long FileSize { get; set; }
    
    // Navigation properties
    public Report Report { get; set; } = null!;
}
