// File: Backend/Backend.Application/Features/Announcements/Handlers/CreateAnnouncementCommandHandler.cs
using Backend.Application.DTOs.Announcements;
using Backend.Application.Features.Announcements.Commands;
using Backend.Domain.Entities;
using Backend.Domain.Interfaces;
using MediatR;
using Microsoft.Extensions.Logging;

namespace Backend.Application.Features.Announcements.Handlers;

public class CreateAnnouncementCommandHandler : IRequestHandler<CreateAnnouncementCommand, AnnouncementDto>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger<CreateAnnouncementCommandHandler> _logger;

    public CreateAnnouncementCommandHandler(
        IUnitOfWork unitOfWork,
        ILogger<CreateAnnouncementCommandHandler> logger)
    {
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    public async Task<AnnouncementDto> Handle(CreateAnnouncementCommand request, CancellationToken cancellationToken)
    {
        try
        {
            // Verify the creator is an admin
            var creator = await _unitOfWork.Users.GetByIdAsync(request.CreatedBy, cancellationToken);
            if (creator == null || creator.Role != UserRole.Administrator)
            {
                _logger.LogWarning("Unauthorized access attempt to create announcement by UserId: {CreatedBy}", request.CreatedBy);
                throw new UnauthorizedAccessException("Only administrators can create announcements");
            }

            // Validate priority
            if (!Enum.IsDefined(typeof(AnnouncementPriority), request.Priority))
            {
                throw new ArgumentException($"Invalid priority value: {request.Priority}");
            }

            var announcement = new Announcement
            {
                Id = Guid.NewGuid(),
                Title = request.Title,
                Content = request.Content,
                Priority = (AnnouncementPriority)request.Priority,
                IsActive = true,
                CreatedBy = request.CreatedBy.ToString(),
                CreatedAt = DateTime.UtcNow
            };

            await _unitOfWork.Announcements.AddAsync(announcement, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            _logger.LogInformation("Announcement created: {AnnouncementId} by {CreatedBy}", announcement.Id, request.CreatedBy);

            return new AnnouncementDto(
                announcement.Id,
                announcement.Title,
                announcement.Content,
                announcement.Priority.ToString(),
                announcement.IsActive,
                $"{creator.FirstName} {creator.LastName}",
                announcement.CreatedAt
            );
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating announcement");
            throw;
        }
    }
}
