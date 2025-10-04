// File: Backend/Backend.Application/DTOs/Announcements/AnnouncementDTOs.cs
namespace Backend.Application.DTOs.Announcements;

public record AnnouncementDto(
    Guid Id,
    string Title,
    string Content,
    string Priority,
    bool IsActive,
    string CreatorName,
    DateTime CreatedAt
);

public record CreateAnnouncementRequest(
    string Title,
    string Content,
    int Priority
);

public record UpdateAnnouncementRequest(
    string Title,
    string Content,
    int Priority,
    bool IsActive
);
