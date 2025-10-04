// File: Backend/Backend.Application/Features/Announcements/Commands/AnnouncementCommands.cs
using Backend.Application.DTOs.Announcements;
using MediatR;

namespace Backend.Application.Features.Announcements.Commands;

public record CreateAnnouncementCommand(
    string Title,
    string Content,
    int Priority,
    Guid CreatedBy
) : IRequest<AnnouncementDto>;

public record UpdateAnnouncementCommand(
    Guid Id,
    string Title,
    string Content,
    int Priority,
    bool IsActive,
    Guid UpdatedBy
) : IRequest<bool>;

public record DeleteAnnouncementCommand(
    Guid Id,
    Guid DeletedBy
) : IRequest<bool>;
