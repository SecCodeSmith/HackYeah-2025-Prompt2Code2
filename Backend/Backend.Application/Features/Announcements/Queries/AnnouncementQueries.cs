// File: Backend/Backend.Application/Features/Announcements/Queries/AnnouncementQueries.cs
using Backend.Application.DTOs.Announcements;
using MediatR;

namespace Backend.Application.Features.Announcements.Queries;

public record GetAllAnnouncementsQuery() : IRequest<List<AnnouncementDto>>;

public record GetActiveAnnouncementsQuery() : IRequest<List<AnnouncementDto>>;

public record GetAnnouncementByIdQuery(
    Guid Id
) : IRequest<AnnouncementDto?>;
