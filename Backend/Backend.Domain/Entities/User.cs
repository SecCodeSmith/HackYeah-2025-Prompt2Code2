using Backend.Domain.Common;

namespace Backend.Domain.Entities;

public class User : BaseEntity
{
    public string Email { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string? PhoneNumber { get; set; }
    public UserRole Role { get; set; }
    public bool IsActive { get; set; } = true;
    public bool EmailConfirmed { get; set; }
    public DateTime? LastLoginAt { get; set; }
    
    // Navigation properties
    public ICollection<Report> Reports { get; set; } = new List<Report>();
    public ICollection<RefreshToken> RefreshTokens { get; set; } = new List<RefreshToken>();
}

public enum UserRole
{
    User = 0,
    Administrator = 1,
    Supervisor = 2
}
