// File: Backend/Backend.Application/Features/Announcements/Handlers/GetActiveAnnouncementsQueryHandler.cs
using Backend.Application.DTOs.Announcements;
using Backend.Application.Features.Announcements.Queries;
using Backend.Domain.Interfaces;
using MediatR;
using Microsoft.Extensions.Logging;

namespace Backend.Application.Features.Announcements.Handlers;

public class GetActiveAnnouncementsQueryHandler : IRequestHandler<GetActiveAnnouncementsQuery, List<AnnouncementDto>>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger<GetActiveAnnouncementsQueryHandler> _logger;

    public GetActiveAnnouncementsQueryHandler(
        IUnitOfWork unitOfWork,
        ILogger<GetActiveAnnouncementsQueryHandler> logger)
    {
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    public async Task<List<AnnouncementDto>> Handle(GetActiveAnnouncementsQuery request, CancellationToken cancellationToken)
    {
        try
        {
            var announcements = await _unitOfWork.Announcements.GetActiveAnnouncementsAsync(cancellationToken);

            var dtos = announcements.Select(a => new AnnouncementDto(
                a.Id,
                a.Title,
                a.Content,
                a.Priority.ToString(),
                a.IsActive,
                $"{a.Creator.FirstName} {a.Creator.LastName}",
                a.CreatedAt
            )).ToList();

            _logger.LogInformation("Retrieved {Count} active announcements", dtos.Count);

            return dtos;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving active announcements");
            throw;
        }
    }
}
